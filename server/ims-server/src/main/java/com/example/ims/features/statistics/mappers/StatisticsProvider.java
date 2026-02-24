package com.example.ims.features.statistics.mappers;

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
  
  // --------------------------------------------------------------
  // 품목별 수량 그래프
  
//  public String selectStockByProduct(Map<String, Object> p) {
//	  StringBuilder sb = new StringBuilder();
//	  sb.append("""
//	    SELECT
//	      pr.id AS productId,
//	      pr.name AS productName,
//	      pr.type AS type,
//	      pr.brand AS brand,
//	      IFNULL(s.`count`, 0) AS stockCount,
//	      IFNULL(ss.safetyStock, 0) AS safetyStock
//	    FROM product pr
//	    LEFT JOIN stock s ON s.product_id = pr.id
//	    LEFT JOIN (
//	      SELECT
//	        base.product_id AS productId,
//	        GREATEST(
//	          0,
//	          ROUND(
//	            IFNULL(out_stats.max_daily_out, 0) * IFNULL(in_stats.max_lt, 0)
//	            - IFNULL(out_stats.avg_daily_out, 0) * IFNULL(in_stats.avg_lt, 0)
//	          )
//	        ) AS safetyStock
//	      FROM (
//	        SELECT DISTINCT pr2.id AS product_id
//	        FROM product pr2
//	      ) base
//	      LEFT JOIN (
//	        SELECT
//	          t.product_id,
//	          MAX(t.daily_qty) AS max_daily_out,
//	          AVG(t.daily_qty) AS avg_daily_out
//	        FROM (
//	          SELECT
//	            o.product_id,
//	            DATE(o.order_date) AS d,
//	            SUM(o.`count`) AS daily_qty
//	          FROM `orders` o
//	          WHERE o.status = 'OUTBOUND_COMPLETE'
//	            AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
//	          GROUP BY o.product_id, DATE(o.order_date)
//	        ) t
//	        GROUP BY t.product_id
//	      ) out_stats ON out_stats.product_id = base.product_id
//	      LEFT JOIN (
//	        SELECT
//	          vi.product_id,
//	          MAX(IFNULL(o.lead_time, 0)) AS max_lt,
//	          AVG(IFNULL(o.lead_time, 0)) AS avg_lt
//	        FROM `orders` o
//	        JOIN vendor_item vi ON vi.id = o.vendor_item_id
//	        WHERE o.status = 'INBOUND_COMPLETE'
//	          AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
//	        GROUP BY vi.product_id
//	      ) in_stats ON in_stats.product_id = base.product_id
//	    ) ss ON ss.productId = pr.id
//	    WHERE 1=1
//	  """);
//
//	  if (org.springframework.util.StringUtils.hasText((String)p.get("type"))) {
//	    sb.append(" AND pr.type = #{type} \n");
//	  }
//
//	  // 안전재고 미만만
//	  Boolean unsafeOnly = (Boolean)p.get("unsafeOnly");
//	  if (unsafeOnly != null && unsafeOnly.booleanValue()) {
//	    sb.append(" AND IFNULL(s.`count`, 0) < IFNULL(ss.safetyStock, 0) \n");
//	  }
//
//	  sb.append("""
//	    ORDER BY pr.name ASC, pr.id ASC
//	    LIMIT #{limit}
//	  """);
//
//	  return sb.toString();
//	}
  
  public String selectStockByProduct(Map<String, Object> p) {
	  StringBuilder sb = new StringBuilder();
	  sb.append("""
	    SELECT
	      pr.id AS productId,
	      pr.name AS productName,
	      pr.type AS type,
	      pr.brand AS brand,
	      IFNULL(s.`count`, 0) AS stockCount,
	      IFNULL(ss.safetyStock, 0) AS safetyStock
	    FROM product pr
	    LEFT JOIN stock s ON s.product_id = pr.id
	    LEFT JOIN (
	      SELECT
	        base.product_id AS productId,
	        GREATEST(
	          0.0,
	          CEIL(
	            (
	              CAST(IFNULL(out_stats.max_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.max_lt, 0) AS DECIMAL(18,6))
	              - CAST(IFNULL(out_stats.avg_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.avg_lt, 0) AS DECIMAL(18,6))
	            )
	            
	          )
	        ) AS safetyStock
	      FROM (
	        SELECT DISTINCT pr2.id AS product_id
	        FROM product pr2
	      ) base
	      LEFT JOIN (
	        SELECT
	          t.product_id,
	          MAX(t.daily_qty) AS max_daily_out,
	          AVG(t.daily_qty) AS avg_daily_out
	        FROM (
	          SELECT
	            o.product_id,
	            DATE(o.order_date) AS d,
	            SUM(o.`count`) AS daily_qty
	          FROM `orders` o
	          WHERE o.status = 'OUTBOUND_COMPLETE'
	            AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
	          GROUP BY o.product_id, DATE(o.order_date)
	        ) t
	        GROUP BY t.product_id
	      ) out_stats ON out_stats.product_id = base.product_id
	      LEFT JOIN (
	        SELECT
	          vi.product_id,
	          MAX(IFNULL(o.lead_time, 0)) AS max_lt,
	          AVG(IFNULL(o.lead_time, 0)) AS avg_lt
	        FROM `orders` o
	        JOIN vendor_item vi ON vi.id = o.vendor_item_id
	        WHERE o.status = 'INBOUND_COMPLETE'
	          AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
	        GROUP BY vi.product_id
	      ) in_stats ON in_stats.product_id = base.product_id
	    ) ss ON ss.productId = pr.id
	    WHERE 1=1
	  """);

	  if (org.springframework.util.StringUtils.hasText((String)p.get("type"))) {
	    sb.append(" AND pr.type = #{type} \n");
	  }

	  // 안전재고 미만만
	  Boolean unsafeOnly = (Boolean)p.get("unsafeOnly");
	  if (unsafeOnly != null && unsafeOnly.booleanValue()) {
	    sb.append(" AND IFNULL(s.`count`, 0) < IFNULL(ss.safetyStock, 0) \n");
	  }

	  sb.append("""
	    ORDER BY pr.name ASC, pr.id ASC
	    LIMIT #{limit}
	  """);

	  return sb.toString();
	}

  
  
  // ------------------------------
  // 재고 회전율
  
  public String selectStockAt(Map<String, Object> p) {
	  return """
	    SELECT h.after_count
	    FROM history h
	    WHERE h.product_id = #{productId}
	      AND h.created_at <= #{at}
	    ORDER BY h.created_at DESC, h.id DESC
	    LIMIT 1
	  """;
	}

	public String selectOutboundQty(Map<String, Object> p) {
	  return """
	    SELECT IFNULL(SUM(o.`count`), 0)
	    FROM `orders` o
	    WHERE o.status = 'OUTBOUND_COMPLETE'
	      AND o.product_id = #{productId}
	      AND DATE(o.order_date) BETWEEN #{from} AND #{to}
	  """;
	}
	
	public String searchrotationProducts(Map<String, Object> p) {
		  return """
		    SELECT
		      pr.id AS productId,
		      pr.name AS productName,
		      pr.product_code AS productCode,
		      pr.brand AS brand,
		      pr.type AS type
		    FROM product pr
		    WHERE 1=1
		      AND (
		        pr.name LIKE CONCAT('%', #{keyword}, '%')
		        OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
		        OR pr.brand LIKE CONCAT('%', #{keyword}, '%')
		      )
		    ORDER BY pr.name ASC, pr.id ASC
		    LIMIT #{limit}
		  """;
		}
  
}




























