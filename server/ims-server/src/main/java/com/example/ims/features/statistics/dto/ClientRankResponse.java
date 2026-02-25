package com.example.ims.features.statistics.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ClientRankResponse {
  private long totalPartners;      
  private List<ClientRankRow> rows; 
}