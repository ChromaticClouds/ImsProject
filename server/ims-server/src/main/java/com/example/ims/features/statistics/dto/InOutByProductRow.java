package com.example.ims.features.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InOutByProductRow {

  private Long productId;
  private String productName;
  private String productCode;
  private String type;
  private String brand;

  private Long inboundQty;
  private Long outboundQty;
  private Long totalQty;
}

