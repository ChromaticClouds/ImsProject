package com.example.ims.features.order.entities;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter
@Setter
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
}
