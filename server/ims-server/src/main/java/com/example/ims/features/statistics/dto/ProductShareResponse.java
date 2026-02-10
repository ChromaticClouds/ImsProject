package com.example.ims.features.statistics.dto;

public record ProductShareResponse(
    String item,
    Long stock,
    Long volume
) {}
