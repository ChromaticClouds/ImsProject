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

    @Column(nullable = false, name = "rec_seq")
    private int recSeq;

    @Column(nullable = false, name = "pla_seq")
    private int plaSeq;

    public void recIncrease() {
        this.recSeq += 1;
    }
}
