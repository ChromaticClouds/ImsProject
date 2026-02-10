package com.example.ims.features.statistics.mapper;

import java.util.Map;

import org.springframework.util.StringUtils;

public class StatisticsProvider {

	// 입출고 수량 합계
  public String selectInOutByProduct(Map<String, Object> p) {
    String keyword = (String) p.get("keyword");
    String type = (String) p.get("type");
    String brand = (String) p.get("brand");

    StringBuilder sb = new StringBuilder();
    sb.append("""
      SELECT
        pr.id AS productId,
        pr.name AS productName,
        pr.product_code AS productCode,
        pr.type AS type,
        pr.brand AS brand,
        IFNULL(inb.in_qty, 0) AS inboundQty,
        IFNULL(outb.out_qty, 0) AS outboundQty,
        (IFNULL(inb.in_qty, 0) + IFNULL(outb.out_qty, 0)) AS totalQty
      FROM product pr
      LEFT JOIN (
        SELECT
          vi.product_id AS product_id,
          SUM(o.`count`) AS in_qty
        FROM `orders` o
        JOIN vendor_item vi ON vi.id = o.vendor_item_id
        WHERE o.status = 'INBOUND_COMPLETE'
          AND o.recieve_date BETWEEN #{from} AND #{to}
        GROUP BY vi.product_id
      ) inb ON inb.product_id = pr.id
      LEFT JOIN (
        SELECT
          o.product_id AS product_id,
          SUM(o.`count`) AS out_qty
        FROM `orders` o
        WHERE o.status = 'OUTBOUND_COMPLETE'
          AND o.order_date BETWEEN #{from} AND #{to}
        GROUP BY o.product_id
      ) outb ON outb.product_id = pr.id
      WHERE 1=1
    """);

    if (StringUtils.hasText(keyword)) {
      sb.append("""
        AND (
          pr.name LIKE CONCAT('%', #{keyword}, '%')
          OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
        )
      """);
    }

    if (StringUtils.hasText(type)) {
      sb.append(" AND pr.type = #{type} \n");
    }

    if (StringUtils.hasText(brand)) {
      sb.append(" AND pr.brand = #{brand} \n");
    }

    sb.append("""
      ORDER BY totalQty DESC, pr.name ASC, pr.id ASC
      LIMIT #{limit}
    """);

    return sb.toString();
  }

  public String selectTypes(Map<String, Object> p) {
    return """
      SELECT DISTINCT pr.type
      FROM product pr
      WHERE pr.type IS NOT NULL AND pr.type <> ''
      ORDER BY pr.type ASC
    """;
  }

  public String selectBrandsByType(Map<String, Object> p) {
    return """
      SELECT DISTINCT pr.brand
      FROM product pr
      WHERE pr.type = #{type}
        AND pr.brand IS NOT NULL AND pr.brand <> ''
      ORDER BY pr.brand ASC
    """;
  }

  public String searchProducts(Map<String, Object> p) {
    return """
      SELECT
        pr.id AS productId,
        pr.name AS productName,
        pr.product_code AS productCode,
        pr.type AS type,
        pr.brand AS brand
      FROM product pr
      WHERE pr.name LIKE CONCAT('%', #{keyword}, '%')
         OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
      ORDER BY pr.name ASC, pr.id ASC
      LIMIT #{limit}
    """;
  }
  
  // ---------------- 
  // 거래처별 입출고 순위 통계
  
  public String selectInboundPartnerRankTop(Map<String, Object> p) {
	  return """
	    SELECT
	      v.vendor_name AS name,
	      SUM(o.`count`) AS qty
	    FROM `orders` o
	    JOIN vendor_item vi ON vi.id = o.vendor_item_id
	    JOIN vendor v ON v.id = vi.vendor_id
	    WHERE o.status = 'INBOUND_COMPLETE'
	      AND o.recieve_date BETWEEN #{from} AND #{to}
	    GROUP BY v.id, v.vendor_name
	    ORDER BY qty DESC, v.vendor_name ASC
	    LIMIT #{limit}
	  """;
	}
  
  public String sumInboundPartnerRankTotal(Map<String, Object> p) {
	  return """
	    SELECT IFNULL(SUM(o.`count`), 0) AS qty
	    FROM `orders` o
	    WHERE o.status = 'INBOUND_COMPLETE'
	      AND o.recieve_date BETWEEN #{from} AND #{to}
	  """;
	}
  
  public String selectOutboundPartnerRankTop(Map<String, Object> p) {
	  return """
	    SELECT
	      v.vendor_name AS name,
	      SUM(o.`count`) AS qty
	    FROM `orders` o
	    JOIN vendor v ON v.id = o.seller_vendor_id
	    WHERE o.status = 'OUTBOUND_COMPLETE'
	      AND o.order_date BETWEEN #{from} AND #{to}
	    GROUP BY v.id, v.vendor_name
	    ORDER BY qty DESC, v.vendor_name ASC
	    LIMIT #{limit}
	  """;
	}
  
  public String sumOutboundPartnerRankTotal(Map<String, Object> p) {
	  return """
	    SELECT IFNULL(SUM(o.`count`), 0) AS qty
	    FROM `orders` o
	    WHERE o.status = 'OUTBOUND_COMPLETE'
	      AND o.order_date BETWEEN #{from} AND #{to}
	  """;
	}




  
  
}




























