package com.example.ims.features.purchaseorder.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    // DB 컬럼 오타 그대로
    @Column(name = "recieve_date")
    private LocalDate recieveDate;

    @Column(name = "count", nullable = false)
    private Integer count;

    @Column(name = "lead_time")
    private Integer leadTime;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "vendor_item_id")
    private Long venderItemId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "seller_vendor_id")
    private Long sellerVendorId;

    public PurchaseOrder() {}

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public LocalDate getRecieveDate() { return recieveDate; }
    public void setRecieveDate(LocalDate recieveDate) { this.recieveDate = recieveDate; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }

    public Integer getLeadTime() { return leadTime; }
    public void setLeadTime(Integer leadTime) { this.leadTime = leadTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getVenderItemId() { return venderItemId; }
    public void setVenderItemId(Long venderItemId) { this.venderItemId = venderItemId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getSellerVendorId() { return sellerVendorId; }
    public void setSellerVendorId(Long sellerVendorId) { this.sellerVendorId = sellerVendorId; }
}
