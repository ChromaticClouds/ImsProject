package com.example.ims.features.purchaseorder.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrderUpdateRequest {

    @NotNull
    private LocalDate recieveDate;

    @NotNull
    private List<ItemPatch> items;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ItemPatch {
        @NotNull private Long orderId;
        @NotNull private Long count;
    }
}




