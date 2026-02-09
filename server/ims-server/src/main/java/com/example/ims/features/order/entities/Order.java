package com.example.ims.features.order.entities;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String orderNumber;
    LocalDate orderDate;
    LocalDate recieveDate;
    Integer count;
    Double leadTime;

    @Enumerated(EnumType.STRING)
    OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_item_id")
    VendorItem vendorItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_vendor_id")
    Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    User manager;

      /* =========================
       Domain Methods
       ========================= */

    /**
     * 출고 담당자 지정
     */
    public void assignManager(User manager) {
        this.manager = manager;
    }

    /**
     * 출고 담당자 미지정 처리
     */
    public void unassignManager() {
        this.manager = null;
    }

    /**
     * 현재 담당자 ID 조회 (null-safe)
     */
    public Long getManagerId() {
        return manager != null ? manager.getId() : null;
    }

    /**
     * 담당자가 이미 지정되어 있는지 여부
     */
    public boolean hasManager() {
        return manager != null;
    }

    /**
     * 같은 담당자인지 비교
     */
    public boolean isSameManager(Long managerId) {
        if (managerId == null) {
            return manager == null;
        }
        return manager != null && manager.getId().equals(managerId);
    }
}
