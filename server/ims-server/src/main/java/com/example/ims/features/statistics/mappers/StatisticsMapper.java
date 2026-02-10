package com.example.ims.features.statistics.mappers;

import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface StatisticsMapper {
    @Select("""
    select coalesce(sum(p.volume * s.count), 0) from product p join stock s
    on p.id = s.product_id
    """)
    Long sumUsedVolume();

    /*
     * TOP5 외 기타 면적을 가장 많이 차지하는 품목에 대한 개수 및 품목명 조회
     */
    @Select("""
    select
      case
        when rnk <= 5 then item
        else '기타'
      end as item,
      sum(stock) as stock,
      sum(used_volume) as usedVolume
    from (
      select
        p.name as item,
        sum(s.count) as stock,
        sum(p.volume * s.count) as used_volume,
        dense_rank() over (order by sum(p.volume * s.count) desc) as rnk
      from product p
      join stock s on p.id = s.product_id
      group by p.id, p.name
    ) t
    group by
      case
        when rnk <= 5 then item
        else '기타'
      end
    order by usedVolume desc;                        
    """)
    List<ProductShareResponse> findTop5ByUsedVolume();

    @Select("""
    select v.vendor_name as name, avg(o.lead_time) as leadTime
    from orders o
    join vendor_item vi on o.vendor_item_id = vi.id
    join vendor v on vi.vendor_id = v.id
    where o.status = 'INBOUND_COMPLETE'
    group by v.vendor_name order by leadTime desc;
    """)
    List<LeadTimeResponse> findLeadTimeByVendor();
}
