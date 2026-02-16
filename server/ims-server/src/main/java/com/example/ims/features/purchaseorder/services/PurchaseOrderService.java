package com.example.ims.features.purchaseorder.services;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ims.features.inbound.dto.InboundSafeStockRow;
import com.example.ims.features.inbound.dto.PageMeta;
import com.example.ims.features.purchaseorder.dto.*;
import com.example.ims.features.purchaseorder.mappers.PurchaseOrderMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderMapper mapper;
    private final PurchaseOrderPdfService pdfService;
    private final PurchaseOrderLoader loader;
    private final PurchaseOrderMailSender mailSender;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public PurchaseOrderListResponse list(String view, String keyword, LocalDate from, LocalDate to, Integer page, Integer size) {
        int p = (page == null || page < 1) ? 1 : page;
        int s = (size == null || size < 1) ? 10 : size;
        int offset = (p - 1) * s;

        List<PurchaseOrderGroupRow> groups = mapper.selectGroupedList(view, keyword, from, to, s, offset);
        long total = mapper.countGroupedList(view, keyword, from, to);

        PurchaseOrderSummaryRow summary = Optional.ofNullable(mapper.selectSummary(view, keyword, from, to))
            .orElse(PurchaseOrderSummaryRow.builder().orderKinds(0).totalCount(0).totalPrice(0).build());

        PageMeta pageMeta = PageMeta.builder()
            .number(p)
            .size(s)
            .totalElements(total)
            .totalPages((int) Math.ceil((double) total / (double) s))
            .build();

        if (groups.isEmpty()) {
            return PurchaseOrderListResponse.of(groups, pageMeta, summary);
        }

        List<String> orderNumbers = groups.stream()
            .map(PurchaseOrderGroupRow::getOrderNumber)
            .filter(Objects::nonNull)
            .distinct()
            .toList();

        List<PurchaseOrderItemRow> items = mapper.selectItemsByOrderNumbers(orderNumbers);

        List<Long> productIds = items.stream()
            .map(PurchaseOrderItemRow::getProductId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();

        Map<Long, Double> safetyStockMap = mapper.selectSafeStock(productIds).stream()
            .collect(Collectors.toMap(
                InboundSafeStockRow::getProductId,
                r -> r.getSafetyStock() == null ? 0.0 : r.getSafetyStock(),
                (a, b) -> a
            ));

        items.forEach(it -> {
            Long pid = it.getProductId();
            it.setSafetyStock(pid == null ? 0.0 : safetyStockMap.getOrDefault(pid, 0.0));
        });

        Map<String, List<PurchaseOrderItemRow>> byOrderNumber =
            items.stream().collect(Collectors.groupingBy(PurchaseOrderItemRow::getOrderNumber));

        for (PurchaseOrderGroupRow g : groups) {
            List<PurchaseOrderItemRow> its = byOrderNumber.getOrDefault(g.getOrderNumber(), List.of());
            g.setItems(its);

            long itemKinds = its.size();
            long totalCount = its.stream().mapToLong(x -> x.getCount() == null ? 0L : x.getCount()).sum();
            long totalPrice = its.stream().mapToLong(x -> (x.getCount() == null ? 0L : x.getCount()) * (x.getPurchasePrice() == null ? 0L : x.getPurchasePrice())).sum();

            g.setItemKinds(itemKinds);
            g.setTotalCount(totalCount);
            g.setTotalPrice(totalPrice);
        }

        return PurchaseOrderListResponse.of(groups, pageMeta, summary);
    }

    @Transactional(readOnly = true)
    public PurchaseOrderGroupRow get(String orderNumber) {
        PurchaseOrderGroupRow g = mapper.selectGroupedOne(orderNumber);
        if (g == null) return null;

        List<PurchaseOrderItemRow> items = mapper.selectItemsByOrderNumbers(List.of(orderNumber));

        List<Long> productIds = items.stream()
            .map(PurchaseOrderItemRow::getProductId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();

        Map<Long, Double> safetyStockMap = mapper.selectSafeStock(productIds).stream()
            .collect(Collectors.toMap(
                InboundSafeStockRow::getProductId,
                r -> r.getSafetyStock() == null ? 0.0 : r.getSafetyStock(),
                (a, b) -> a
            ));

        items.forEach(it -> {
            Long pid = it.getProductId();
            it.setSafetyStock(pid == null ? 0.0 : safetyStockMap.getOrDefault(pid, 0.0));
        });

        g.setItems(items);
        g.setItemKinds((long) items.size());
        g.setTotalCount(items.stream().mapToLong(x -> x.getCount() == null ? 0L : x.getCount()).sum());
        g.setTotalPrice(items.stream().mapToLong(x -> (x.getCount() == null ? 0L : x.getCount()) * (x.getPurchasePrice() == null ? 0L : x.getPurchasePrice())).sum());
        return g;
    }

    @Transactional
    public void update(String orderNumber, PurchaseOrderUpdateRequest req) {
        mapper.updateRecieveDateByOrderNumber(orderNumber, req.getRecieveDate());
        for (PurchaseOrderUpdateRequest.ItemPatch it : req.getItems()) {
            mapper.updateCountByOrderId(it.getOrderId(), it.getCount());
        }
    }

    @Transactional
    public void delete(String orderNumber) {
        mapper.deleteByOrderNumber(orderNumber);
    }

    @Transactional
    public void sendOne(String orderNumber) throws ResendException {
        PurchaseOrderContext ctx = loader.load(orderNumber);
        PurchaseOrderPdfContent content = pdfService.buildDto(ctx);
        byte[] pdf = pdfService.generate(content);

        String html = PurchaseOrderHtmlTemplate.render(ctx, content);

        mailSender.sendPurchaseOrder(ctx, html, pdf);

        mapper.markSentByOrderNumber(orderNumber);
    }

    public SendGroupResult bulkSend(List<String> orderNumbers) {
        LoadGroupResult load = loader.loadGroup(orderNumbers);

        List<SendGroupResult.Success> success = new ArrayList<>();
        List<SendGroupResult.Fail> failed = new ArrayList<>(
            load.failed().stream()
                .map(f -> new SendGroupResult.Fail(f.orderNumber(), "LOAD", f.reason()))
                .toList()
        );

        for (PurchaseOrderContext ctx : load.contexts()) {
            try {
                PurchaseOrderPdfContent content = pdfService.buildDto(ctx);
                byte[] pdf = pdfService.generate(content);
                String html = PurchaseOrderHtmlTemplate.render(ctx, content);

                mailSender.sendPurchaseOrder(ctx, html, pdf);

                mapper.markSentByOrderNumber(ctx.orderNumber());

                success.add(new SendGroupResult.Success(ctx.orderNumber()));
            } catch (Exception e) {
                failed.add(new SendGroupResult.Fail(ctx.orderNumber(), "SEND", e.getMessage()));
            }
        }

        return new SendGroupResult(success, failed);
    }

    @Transactional
    public void bulkDelete(List<String> orderNumbers) {
        if (orderNumbers == null || orderNumbers.isEmpty()) return;
        mapper.bulkDeleteByOrderNumbers(orderNumbers);
    }
}


