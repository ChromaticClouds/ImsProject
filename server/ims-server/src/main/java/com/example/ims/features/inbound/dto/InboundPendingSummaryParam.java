package com.example.ims.features.inbound.dto;

import java.time.LocalDate;
import lombok.*;

@Getter @Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class InboundPendingSummaryParam {
  private LocalDate from;
  private LocalDate to;
  private String keyword;
  private Integer offset;
  private Integer size;
}
