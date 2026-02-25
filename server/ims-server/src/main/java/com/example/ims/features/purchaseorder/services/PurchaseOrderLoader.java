package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.exceptions.OrderNotFoundException;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.purchaseorder.dto.LoadGroupResult;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderLoader {

    private final OrderRepository orderRepository;

    public PurchaseOrderContext load(String orderNumber) {
        if (orderNumber == null || !orderNumber.startsWith("PLA-"))
            throw new OrderNotFoundException(orderNumber);

        List<Order> orders = orderRepository.findAllByOrderNumber(orderNumber);

        if (orders.isEmpty())
            throw new IllegalStateException("해당 주문번호의 발주 데이터가 없습니다.");

        return validateAndBuild(orderNumber, orders);
    }

    public LoadGroupResult loadGroup(List<String> orderNumbers) {
        if (orderNumbers == null || orderNumbers.isEmpty())
            return new LoadGroupResult(List.of(), List.of());

        List<String> normalized = orderNumbers.stream()
            .filter(Objects::nonNull)
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .distinct()
            .toList();

        List<LoadGroupResult.Fail> failed = new ArrayList<>();
        List<String> poOnly = new ArrayList<>();

        for (String no: normalized) {
            if (!no.startsWith("PLA-")) failed.add(
                new LoadGroupResult.Fail(no, "발주(PLA) 주문번호만 허용됩니다"));
            else poOnly.add(no);
        }

        if (poOnly.isEmpty()) return new LoadGroupResult(List.of(), failed);

        List<Order> allOrders = orderRepository.findAllByOrderNumberIn(poOnly);

        Map<String, List<Order>> grouped = allOrders.stream()
            .collect(Collectors.groupingBy(Order::getOrderNumber));

        for (String no: poOnly) {
            if (!grouped.containsKey(no))
                failed.add(new LoadGroupResult.Fail(no, "해당 주문번호의 발주 데이터가 없습니다."));
        }

        List<PurchaseOrderContext> contexts = new ArrayList<>();
        for (Map.Entry<String, List<Order>> entry: grouped.entrySet()) {
            String no = entry.getKey();
            List<Order> orders = entry.getValue();

            try {
                contexts.add(validateAndBuild(no, orders));
            } catch (RuntimeException e) {
                failed.add(new LoadGroupResult.Fail(no, e.getMessage()));
            }
        }

        Map<String, Integer> orderIndex = new HashMap<>();
        for (int i = 0; i < normalized.size(); i++) orderIndex.put(normalized.get(i), i);

        contexts.sort(Comparator.comparingInt(c ->
            orderIndex.getOrDefault(c.orderNumber(), Integer.MAX_VALUE)
        ));

        return new LoadGroupResult(contexts, failed);
    }

    private PurchaseOrderContext validateAndBuild(
        String orderNumber,
        List<Order> orders
    ) {
        if (orders.isEmpty()) throw new OrderNotFoundException();

        List<VendorItem> items = orders.stream()
            .map(Order::getVendorItem)
            .filter(Objects::nonNull)
            .toList();

        if (items.isEmpty())
            throw new IllegalStateException("발주 품목이 비어있습니다.");

        Set<Long> vendorIds = items.stream()
            .map(VendorItem::getVendor)
            .filter(Objects::nonNull)
            .map(Vendor::getId)
            .collect(Collectors.toSet());

        if (vendorIds.size() != 1)
            throw new IllegalStateException("하나의 발주서는 단일 공급처만 허용됩니다.");

        Vendor vendor = items.getFirst().getVendor();

        if (vendor.getEmail() == null || vendor.getEmail().isEmpty())
            throw new IllegalStateException("공급처 이메일이 없어 전송할 수 없습니다.");

        User user = orders.getFirst().getUser();

        Set<Long> userIds = orders.stream()
            .map(Order::getUser)
            .filter(Objects::nonNull)
            .map(User::getId)
            .collect(Collectors.toSet());

        if (userIds.size() != 1)
            throw new IllegalStateException("하나의 발주서는 단일 담당자만 허용됩니다.");

        if (user == null)
            throw new IllegalStateException("발주 담당자 정보가 없어 전송할 수 없습니다.");

        if (user.getName() == null || user.getName().isBlank())
            throw new IllegalStateException("담당자 이름이 없어 발주서를 전송할 수 없습니다.");

        LocalDate receiveDate = orders.getFirst().getRecieveDate();

        if (receiveDate == null)
            throw new IllegalStateException("납기 희망일이 지정되지 않았습니다.");

        LocalDate today = LocalDate.now();

        if (receiveDate.isBefore(today))
            throw new IllegalStateException("납기 희망일은 오늘 이후 날짜여야 합니다.");

        String receiveDateStr =
            receiveDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        return new PurchaseOrderContext(user, orderNumber, vendor, receiveDateStr, orders);
    }
}
