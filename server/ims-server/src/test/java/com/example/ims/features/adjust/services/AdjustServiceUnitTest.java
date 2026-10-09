package com.example.ims.features.adjust.services;

import com.example.ims.features.adjust.dto.AdjustItem;
import com.example.ims.features.adjust.dto.AdjustRequest;
import com.example.ims.features.adjust.enums.AdjustType;
import com.example.ims.features.adjust.exceptions.InvalidAdjustRequestException;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.history.repostories.HistoryLotRepository;
import com.example.ims.features.history.repostories.HistoryRepository;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.stock.entities.Stock;
import com.example.ims.features.stock.exceptions.StockEmptyException;
import com.example.ims.features.stock.exceptions.StockNotFoundException;
import com.example.ims.features.stock.repositories.StockRepository;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.inOrder;
import org.mockito.ArgumentCaptor;
import com.example.ims.features.history.entities.History;
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
        when(stockRepository.findByProductIdForUpdate(10L)).thenReturn(Optional.of(stock));

        AdjustRequest request = request(AdjustType.MINUS, 6);

        StockEmptyException exception =
            assertThrows(StockEmptyException.class, () -> service.adjustProducts(1L, request));
        assertEquals(HttpStatus.CONFLICT, exception.getHttpStatus());
        assertEquals(5, stock.getCount());
        verify(historyLotRepository, never()).save(any());
        verify(historyRepository, never()).saveAll(any());
    }

    @Test
    void plusAdjustmentRejectsIntegerOverflow() {
        AdjustService service = service();
        Stock stock = stock(10L, Integer.MAX_VALUE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdForUpdate(10L)).thenReturn(Optional.of(stock));

        AdjustRequest request = request(AdjustType.PLUS, 1);

        InvalidAdjustRequestException exception =
            assertThrows(InvalidAdjustRequestException.class, () -> service.adjustProducts(1L, request));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getHttpStatus());
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
        when(stockRepository.findByProductIdForUpdate(10L)).thenReturn(Optional.of(stock));
        when(vendorItemRepository.findByProductId(10L)).thenReturn(Optional.of(vendorItem));

        service.adjustProducts(1L, request(AdjustType.MINUS, 5));

        assertEquals(0, stock.getCount());
        verify(historyLotRepository).save(any());
        verify(historyRepository).saveAll(any());
    }

    @Test
    void missingAdjustTypeIsBadRequest() {
        AdjustService service = service();
        AdjustRequest request = new AdjustRequest(List.of(item(1)), null, null, "memo");

        InvalidAdjustRequestException exception =
            assertThrows(InvalidAdjustRequestException.class, () -> service.adjustProducts(1L, request));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getHttpStatus());
        verify(stockRepository, never()).findByProductIdForUpdate(any());
    }

    @Test
    void emptyProductsIsBadRequest() {
        AdjustService service = service();
        AdjustRequest request = new AdjustRequest(List.of(), AdjustType.PLUS, null, "memo");

        assertThrows(InvalidAdjustRequestException.class, () -> service.adjustProducts(1L, request));
        verify(stockRepository, never()).findByProductIdForUpdate(any());
    }

    @Test
    void nonPositiveCountIsBadRequest() {
        AdjustService service = service();
        AdjustRequest request = new AdjustRequest(List.of(item(0)), AdjustType.PLUS, null, "memo");

        assertThrows(InvalidAdjustRequestException.class, () -> service.adjustProducts(1L, request));
        verify(stockRepository, never()).findByProductIdForUpdate(any());
    }

    @Test
    void unknownStockIsNotFound() {
        AdjustService service = service();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdForUpdate(10L)).thenReturn(Optional.empty());

        StockNotFoundException exception = assertThrows(
            StockNotFoundException.class,
            () -> service.adjustProducts(1L, request(AdjustType.PLUS, 1))
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getHttpStatus());
    }

    @Test
    void reversedAndDuplicateItemsLockOnceInAscendingOrderBeforeWriting() {
        Stock a = stock(10L, 100);
        Stock b = stock(30L, 100);
        VendorItem va = new VendorItem();
        va.setProduct(a.getProduct());
        VendorItem vb = new VendorItem();
        vb.setProduct(b.getProduct());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1L)));
        when(stockRepository.findByProductIdForUpdate(10L)).thenReturn(Optional.of(a));
        when(stockRepository.findByProductIdForUpdate(30L)).thenReturn(Optional.of(b));
        when(vendorItemRepository.findByProductId(10L)).thenReturn(Optional.of(va));
        when(vendorItemRepository.findByProductId(30L)).thenReturn(Optional.of(vb));
        AdjustItem first = new AdjustItem(30L, "상품", "브랜드", "종류", 100, 100, 200, null, 1);
        service().adjustProducts(1L, new AdjustRequest(List.of(first, item(2), item(3)), AdjustType.MINUS, null, "memo"));

        var order = inOrder(stockRepository, historyLotRepository, historyRepository);
        order.verify(stockRepository).findByProductIdForUpdate(10L);
        order.verify(stockRepository).findByProductIdForUpdate(30L);
        order.verify(historyLotRepository).save(any());
        ArgumentCaptor<List<History>> histories = ArgumentCaptor.forClass(List.class);
        order.verify(historyRepository).saveAll(histories.capture());
        verify(stockRepository).findByProductIdForUpdate(10L);
        assertEquals(95, a.getCount());
        assertEquals(99, b.getCount());
        assertEquals(List.of(100, 100, 98), histories.getValue().stream().map(History::getBeforeCount).toList());
        assertEquals(List.of(99, 98, 95), histories.getValue().stream().map(History::getAfterCount).toList());
    }

    private AdjustItem item(int count) {
        return new AdjustItem(10L, "상품", "브랜드", "종류", 5, 100, 200, null, count);
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
