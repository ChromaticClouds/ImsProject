package com.example.ims.features.adjust.dto;

import java.time.LocalDate;
import java.util.List;

public record AdjustRequest(
    List<AdjustItem> products,
    LocalDate date,
    String memo
) {}
