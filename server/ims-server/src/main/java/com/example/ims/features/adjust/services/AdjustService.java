package com.example.ims.features.adjust.services;

import com.example.ims.features.adjust.dto.AdjustItem;
import com.example.ims.features.adjust.dto.AdjustRequest;
import com.example.ims.features.adjust.enums.AdjustType;
import com.example.ims.features.adjust.exceptions.InvalidAdjustRequestException;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.history.entities.History;
import com.example.ims.features.history.entities.HistoryLot;
import com.example.ims.features.history.enums.HistoryStatus;
import com.example.ims.features.history.repostories.HistoryLotRepository;
import com.example.ims.features.history.repostories.HistoryRepository;
import com.example.ims.features.stock.entities.Stock;
import com.example.ims.features.stock.exceptions.StockEmptyException;
import com.example.ims.features.stock.exceptions.StockNotFoundException;
import com.example.ims.features.stock.repositories.StockRepository;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdjustService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final VendorItemRepository vendorItemRepository;
    private final HistoryLotRepository historyLotRepository;
    private final HistoryRepository historyRepository;

    @Transactional
    public void adjustProducts(Long userId, AdjustRequest request) {
        if (request == null || request.type() == null) {
            throw new InvalidAdjustRequestException("재고조정 유형은 필수입니다.");
        }
        if (request.products() == null || request.products().isEmpty()) {
            throw new InvalidAdjustRequestException("조정할 품목을 1개 이상 선택해야 합니다.");
        }

        for (AdjustItem item : request.products()) {
            if (item == null || item.id() == null || item.id() <= 0) {
                throw new InvalidAdjustRequestException("유효한 조정 품목 ID가 필요합니다.");
            }
            if (item.adjustCount() == null || item.adjustCount() <= 0) {
                throw new InvalidAdjustRequestException("조정 수량은 1 이상이어야 합니다.");
            }
        }

        User user = userRepository.findById(userId)
            .orElseThrow(UserNotFoundException::new);

        List<Long> ids = request.products().stream()
            .map(AdjustItem::id)
            .distinct()
            .sorted()
            .toList();

        // 입출고 완료와 같은 productId 순서로 단건 잠금을 모두 얻은 뒤 처리한다.
        // IN 쿼리의 실행 계획이나 반환 순서는 실제 잠금 순서를 보장하지 않는다.
        Map<Long, Stock> stockMap = new HashMap<>();
        for (Long id : ids) {
            Stock stock = stockRepository.findByProductIdForUpdate(id)
                .orElseThrow(StockNotFoundException::new);
            stockMap.put(id, stock);
        }

        Map<Long, Integer> projectedCounts = new HashMap<>();
        List<AdjustmentPlan> plans = new ArrayList<>();

        for (AdjustItem item : request.products()) {
            Stock stock = stockMap.get(item.id());
            if (stock == null) throw new StockNotFoundException();

            Integer persistedCount = stock.getCount();
            if (persistedCount == null || persistedCount < 0) {
                throw new IllegalStateException("현재 재고 수량이 유효하지 않습니다. productId=" + item.id());
            }

            int before = projectedCounts.getOrDefault(item.id(), persistedCount);
            int after = calculateAfterCount(before, item.adjustCount(), request.type());

            VendorItem vendorItem = vendorItemRepository
                .findByProductId(stock.getProduct().getId())
                .orElseThrow(StockNotFoundException::new);

            projectedCounts.put(item.id(), after);
            plans.add(new AdjustmentPlan(stock, vendorItem, before, after));
        }

        HistoryLot historyLot = HistoryLot.builder()
            .user(user)
            .status(HistoryStatus.ADJUST)
            .memo(request.memo())
            .build();

        historyLotRepository.save(historyLot);

        List<History> histories = new ArrayList<>();

        for (AdjustmentPlan plan : plans) {
            plan.stock().setCount(plan.afterCount());

            History history = History.builder()
                .historyLot(historyLot)
                .vendorItem(plan.vendorItem())
                .product(plan.stock().getProduct())
                .beforeCount(plan.beforeCount())
                .afterCount(plan.afterCount())
                .createdAt(LocalDateTime.now())
                .build();

            histories.add(history);
        }

        historyRepository.saveAll(histories);
    }

    private int calculateAfterCount(int before, int adjustCount, AdjustType type) {
        if (type == AdjustType.MINUS && adjustCount > before) {
            throw new StockEmptyException();
        }

        try {
            return type == AdjustType.PLUS
                ? Math.addExact(before, adjustCount)
                : Math.subtractExact(before, adjustCount);
        } catch (ArithmeticException exception) {
            throw new InvalidAdjustRequestException("재고 수량이 허용 범위를 초과합니다.", exception);
        }
    }

    private record AdjustmentPlan(
        Stock stock,
        VendorItem vendorItem,
        int beforeCount,
        int afterCount
    ) {}
}
