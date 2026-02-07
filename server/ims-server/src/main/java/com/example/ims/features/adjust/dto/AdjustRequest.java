package com.example.ims.features.adjust.dto;

import com.example.ims.features.adjust.enums.AdjustType;

import java.time.LocalDate;
import java.util.List;

public record AdjustRequest(
    List<AdjustItem> products,
    AdjustType type,
    LocalDate date,
    String memo
) {}
