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

    public String generate() {
        return next(false);
    }

    @Transactional
    public String issue() {
        return next(true);
    }

    private String next(boolean persist) {
        String today = LocalDate.now()
            .format(DateTimeFormatter.BASIC_ISO_DATE);

        OrderSequence seq = sequenceRepository
            .findById(today)
            .orElseGet(() -> new OrderSequence(today, 0));

        seq.increase();

        if (persist) {
            sequenceRepository.save(seq);
        }

        return format(today, seq.getSeq());
    }

    private String format(String date, int seq) {
        return String.format(
            "ORD-%s-%06d",
            date,
            seq
        );
    }
}
