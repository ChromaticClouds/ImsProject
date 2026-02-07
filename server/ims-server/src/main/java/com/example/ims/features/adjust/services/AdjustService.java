package com.example.ims.features.adjust.services;

import com.example.ims.features.adjust.dto.AdjustItem;
import com.example.ims.features.adjust.dto.AdjustRequest;
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
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        User user = userRepository.findById(userId)
            .orElseThrow(UserNotFoundException::new);

        HistoryLot historyLot = HistoryLot.builder()
            .user(user)
            .status(HistoryStatus.ADJUST)
            .memo(request.memo())
            .build();

        historyLotRepository.save(historyLot);

        List<Long> ids = request.products().stream()
            .map(AdjustItem::id)
            .toList();

        List<Stock> stocks = stockRepository.findByProductIdIn(ids);

        Map<Long, Stock> stockMap = stocks.stream()
            .collect(Collectors.toMap(
                s -> s.getProduct().getId(),
                Function.identity()
            ));

        List<History> histories = new ArrayList<>();

        for (AdjustItem item: request.products()) {
            Stock stock = stockMap.get(item.id());

            if (stock == null) throw new StockNotFoundException();

            int before = stock.getCount();
            int after = item.adjustCount();

            if (after < 0) throw new StockEmptyException();

            stock.setCount(after);

            VendorItem vendorItem = vendorItemRepository
                .findByProductId(stock.getProduct().getId())
                .orElseThrow(StockNotFoundException::new);

            History history = History.builder()
                .historyLot(historyLot)
                .vendorItem(vendorItem)
                .product(stock.getProduct())
                .beforeCount(before)
                .afterCount(after)
                .createdAt(LocalDateTime.now())
                .build();

            histories.add(history);
        }

        historyRepository.saveAll(histories);
    }
}
