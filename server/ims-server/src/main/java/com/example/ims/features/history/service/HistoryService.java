package com.example.ims.features.history.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.history.dto.*;
import com.example.ims.features.history.mapper.HistoryMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {

  private final HistoryMapper mapper;

  private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");

  public PageResponse<HistoryLotSummaryRow> getLots(
      LocalDate from,
      LocalDate to,
      String q,
      String kind,
      Long targetId,
      String status,
      String type,
      String brand,
      int page,
      int size
  ) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 200);
    int offset = safePage * safeSize;

    String fromYmd = from.format(YMD);
    String toYmd = to.format(YMD);

    List<HistoryLotSummaryRow> rows = mapper.selectLotSummaries(
        fromYmd, toYmd,
        emptyToNull(status),
        emptyToNull(type),
        emptyToNull(brand),
        emptyToNull(kind),
        targetId,
        emptyToNull(q),
        offset,
        safeSize
    );

    long total = mapper.countLotSummaries(
        fromYmd, toYmd,
        emptyToNull(status),
        emptyToNull(type),
        emptyToNull(brand),
        emptyToNull(kind),
        targetId,
        emptyToNull(q)
    );

    return PageResponse.of(rows, safePage, safeSize, total);
  }

  public List<String> getBrandsByType(String type) {
    if (!StringUtils.hasText(type)) return List.of();
    return mapper.selectBrandsByType(type.trim());
  }

  public List<HistorySearchSuggestionRow> searchSuggestions(String q) {
    if (!StringUtils.hasText(q)) return List.of();
    return mapper.searchSuggestions(q.trim(), 20);
  }

  private String emptyToNull(String s) {
    return StringUtils.hasText(s) ? s.trim() : null;
  }
  
  public String getMinCreatedDateYmd() {
	    return mapper.selectMinCreatedDateYmd();
	  }
  
  
  
}
