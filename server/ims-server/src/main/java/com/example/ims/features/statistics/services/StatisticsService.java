package com.example.ims.features.statistics.services;

import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.WarehouseShareResponse;
import com.example.ims.features.statistics.mappers.StatisticsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private static final long WAREHOUSE_VOLUME_ML = 80_000_000L;

    private final StatisticsMapper mapper;

    public WarehouseShareResponse getWarehouseShare() {
        Long usedVolume = mapper.sumUsedVolume();
        Long totalVolume = WAREHOUSE_VOLUME_ML;
        return new WarehouseShareResponse(usedVolume, totalVolume);
    }

    public List<ProductShareResponse> getProductShare() {
        return mapper.findTop5ByUsedVolume();
    }

    public List<LeadTimeResponse> getLeadTime() {
        return mapper.findLeadTimeByVendor();
    }
}
