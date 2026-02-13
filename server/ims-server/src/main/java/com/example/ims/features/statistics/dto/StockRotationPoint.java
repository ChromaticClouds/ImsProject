package com.example.ims.features.statistics.dto;
import com.example.ims.features.product.enums.ProductType;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockRotationPoint {
  private String period;     // "01월" or "2주차"
  private Long outboundQty;
  private Integer beginStock;
  private Integer endStock;
  private Double avgStock;
  private Double turnover;   // 회전율
  
  private Long productId;
  private String productName;
  private String productCode;
  private String brand;
  private ProductType type;
}
