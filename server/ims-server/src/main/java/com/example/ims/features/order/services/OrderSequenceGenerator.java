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
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;

    /**
     * 수주 번호 조회
     */
    @Transactional(readOnly = true)
    public String generateReceiveOrder() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        OrderSequence seq = sequenceRepository.findById(today)
            .orElse(new OrderSequence(today, 0, 0));
        int nextRec = seq.getRecSeq() + 1;
        return format("REC", today, nextRec);
    }

    /**
     * 수주 번호 발급 및 저장
     */
    @Transactional
    public String issueReceiveOrder() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        OrderSequence seq = sequenceRepository.findByIdForUpdate(today)
            .orElseGet(() -> new OrderSequence(today, 0, 0));
        seq.recIncrease();
        sequenceRepository.save(seq);
        return format("REC", today, seq.getRecSeq());
    }

    /**
     * 발주 번호 조회
     */
    public String generatePlaceOrder() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        OrderSequence seq = sequenceRepository.findById(today)
            .orElse(new OrderSequence(today, 0, 0));
        int nextPla = seq.getPlaSeq() + 1;
        return format("PLA", today, nextPla);
    }

    /**
     * 발주 번호 발급 및 저장
     */
    @Transactional
    public String issuePlaceOrder() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        OrderSequence seq = sequenceRepository.findByIdForUpdate(today)
            .orElseGet(() -> new OrderSequence(today, 0, 0));
        seq.plaIncrease();
        sequenceRepository.save(seq);
        return format("PLA", today, seq.getPlaSeq());
    }

    public String format(String type, String date, int seq) {
        return String.format("%s-%s-%06d", type, date, seq);
    }
}
