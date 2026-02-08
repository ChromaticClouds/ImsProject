package com.example.ims.features.order.services;

import com.example.ims.features.order.entities.OrderSequence;
import com.example.ims.features.order.repositories.OrderSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class OrderSequenceGenerator {

    private final OrderSequenceRepository sequenceRepository;

    @Transactional
    public String generate() {
        String today = LocalDate.now()
            .format(DateTimeFormatter.BASIC_ISO_DATE);

        OrderSequence seq = sequenceRepository
            .findById(today)
            .orElseGet(() -> new OrderSequence(today, 0));

        seq.increase();

        return String.format(
            "ORD-%s-%06d",
            today,
            seq.getSeq()
        );
    }
}
