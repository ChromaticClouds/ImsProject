package com.example.ims.features.purchaseorder.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class OrderNumbersRequest {
    @NotEmpty
    private List<String> orderNumbers;
}
