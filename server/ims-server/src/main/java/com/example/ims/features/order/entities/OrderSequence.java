package com.example.ims.features.order.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_sequence")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderSequence {

    @Id
    @Column(name = "order_date")
    private String orderDate;

    @Column(nullable = false)
    private int seq;

    public void increase() {
        this.seq += 1;
    }
}
