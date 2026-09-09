package com.example.ims.features.adjust.services;

import com.example.ims.features.adjust.dto.AdjustItem;
import com.example.ims.features.adjust.dto.AdjustRequest;
import com.example.ims.features.adjust.enums.AdjustType;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.history.repostories.HistoryLotRepository;
import com.example.ims.features.history.repostories.HistoryRepository;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.stock.entities.Stock;
import com.example.ims.features.stock.exceptions.StockEmptyException;
import com.example.ims.features.stock.repositories.StockRepository;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdjustServiceUnitTest {

    @Mock UserRepository userRepository;
    @Mock StockRepository stockRepository;
    @Mock VendorItemRepository vendorItemRepository;
    @Mock HistoryLotRepository historyLotRepository;
    @Mock HistoryRepository historyRepository;

    @Test
    void minusAdjustmentCannotExceedCurrentStock() {
        AdjustService service = service();
        Stock stock = stock(10L, 5);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdIn(List.of(10L))).thenReturn(List.of(stock));

        AdjustRequest request = request(AdjustType.MINUS, 6);

        assertThrows(StockEmptyException.class, () -> service.adjustProducts(1L, request));
        assertEquals(5, stock.getCount());
        verify(historyLotRepository, never()).save(any());
        verify(historyRepository, never()).saveAll(any());
    }

    @Test
    void plusAdjustmentRejectsIntegerOverflow() {
        AdjustService service = service();
        Stock stock = stock(10L, Integer.MAX_VALUE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdIn(List.of(10L))).thenReturn(List.of(stock));

        AdjustRequest request = request(AdjustType.PLUS, 1);

        assertThrows(IllegalArgumentException.class, () -> service.adjustProducts(1L, request));
        assertEquals(Integer.MAX_VALUE, stock.getCount());
        verify(historyLotRepository, never()).save(any());
        verify(historyRepository, never()).saveAll(any());
    }

    @Test
    void validMinusAdjustmentPersistsNonNegativeBalance() {
        AdjustService service = service();
        Stock stock = stock(10L, 5);
        VendorItem vendorItem = new VendorItem();
        vendorItem.setProduct(stock.getProduct());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdIn(List.of(10L))).thenReturn(List.of(stock));
        when(vendorItemRepository.findByProductId(10L)).thenReturn(Optional.of(vendorItem));

        service.adjustProducts(1L, request(AdjustType.MINUS, 5));

        assertEquals(0, stock.getCount());
        verify(historyLotRepository).save(any());
        verify(historyRepository).saveAll(any());
    }

    private AdjustService service() {
        return new AdjustService(
            userRepository,
            stockRepository,
            vendorItemRepository,
            historyLotRepository,
            historyRepository
        );
    }

    private AdjustRequest request(AdjustType type, int count) {
        AdjustItem item = new AdjustItem(
            10L, "상품", "브랜드", "종류", 5, 100, 200, null, count
        );
        return new AdjustRequest(List.of(item), type, null, "재고조정 테스트");
    }

    private Stock stock(Long productId, int count) {
        Product product = new Product();
        product.setId(productId);

        Stock stock = new Stock();
        stock.setProduct(product);
        stock.setCount(count);
        return stock;
    }

    private User user(Long id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
