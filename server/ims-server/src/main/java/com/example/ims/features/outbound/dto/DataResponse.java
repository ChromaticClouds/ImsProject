package com.example.ims.features.outbound.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class DataResponse<T> {
  private T data;
}
