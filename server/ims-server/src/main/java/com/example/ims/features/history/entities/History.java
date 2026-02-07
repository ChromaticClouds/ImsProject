package com.example.ims.features.history.entities;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.history.enums.HistoryStatus;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private HistoryLot historyLot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_item_id")
    VendorItem vendorItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    Product product;

    Integer beforeCount;
    Integer afterCount;

    @Column(nullable = false)
    LocalDateTime createdAt;
}
