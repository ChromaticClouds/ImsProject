package com.example.ims.features.purchaseorder.mappers;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.jdbc.SQL;
import org.springframework.util.StringUtils;

public class PurchaseOrderSqlProvider {

    // 그룹 목록 
    public String selectGroupedList(Map<String, Object> p) {
        SQL sql = baseGroupedSelect(p);
        sql.ORDER_BY("MAX(o.id) DESC");
        return sql.toString() + " LIMIT #{limit} OFFSET #{offset}";
    }

    public String countGroupedList(Map<String, Object> p) {
        return new SQL(){{
            SELECT("COUNT(DISTINCT o.order_number)");
            FROM("orders o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            JOIN("product pr ON pr.id = vi.product_id");
            applyWhere(this, p);
        }}.toString();
    }

    public String selectGroupedOne(Map<String, Object> p) {
        return new SQL(){{
            SELECT(
                "o.order_number AS orderNumber",
                "MIN(o.order_date) AS orderDate",
                "MAX(o.recieve_date) AS recieveDate",

                // ✅ status 우선순위: COMPLETE > PENDING > NULL
                "CASE " +
                "  WHEN MAX(CASE WHEN o.status = 'INBOUND_COMPLETE' THEN 1 ELSE 0 END) = 1 THEN 'INBOUND_COMPLETE' " +
                "  WHEN MAX(CASE WHEN o.status = 'INBOUND_PENDING'  THEN 1 ELSE 0 END) = 1 THEN 'INBOUND_PENDING' " +
                "  ELSE NULL " +
                "END AS status",

                "MIN(v.id) AS vendorId",
                "MIN(v.vendor_name) AS vendorName"
            );
            FROM("orders o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            WHERE("o.order_number = #{orderNumber}");

           
            GROUP_BY("o.order_number");
        }}.toString();
    }


    private SQL baseGroupedSelect(Map<String, Object> p) {
        return new SQL(){{
            SELECT(
                "o.order_number AS orderNumber",
                "MIN(o.order_date) AS orderDate",
                "MAX(o.recieve_date) AS recieveDate",
                "CASE " +
                "  WHEN MAX(CASE WHEN o.status = 'INBOUND_COMPLETE' THEN 1 ELSE 0 END) = 1 THEN 'INBOUND_COMPLETE' " +
                "  WHEN MAX(CASE WHEN o.status = 'INBOUND_PENDING'  THEN 1 ELSE 0 END) = 1 THEN 'INBOUND_PENDING' " +
                "  ELSE NULL " +
                "END AS status",

                "MIN(v.id) AS vendorId",
                "MIN(v.vendor_name) AS vendorName"
            );
            FROM("orders o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            JOIN("product pr ON pr.id = vi.product_id");

            applyWhere(this, p);

            GROUP_BY("o.order_number");
        }};
    }


    private void applyWhere(SQL sql, Map<String, Object> p) {
        String view = (String) p.get("view");
        String keyword = (String) p.get("keyword");

        if (StringUtils.hasText(view)) {
            if ("DRAFT".equals(view)) {
                sql.WHERE("o.status IS NULL");
            } else if ("SENT".equals(view)) {
                sql.WHERE("(o.status = 'INBOUND_PENDING' OR o.status = 'INBOUND_COMPLETE')");
            }
        }

        if (p.get("from") != null) {
            sql.WHERE("o.order_date >= #{from}");
        }
        if (p.get("to") != null) {
            sql.WHERE("o.order_date <= #{to}");
        }

        if (StringUtils.hasText(keyword)) {
            sql.WHERE(
                "( LOWER(o.order_number) LIKE CONCAT('%', LOWER(TRIM(#{keyword})), '%') " +
                "OR LOWER(v.vendor_name) LIKE CONCAT('%', LOWER(TRIM(#{keyword})), '%') " +
                "OR LOWER(pr.name) LIKE CONCAT('%', LOWER(TRIM(#{keyword})), '%') )"
            );
        }
    }


//    public String selectSafeStock(Map<String, Object> p) {
//        @SuppressWarnings("unchecked")
//        List<Long> productIds = (List<Long>) p.get("productIds");
//
//        if (productIds == null || productIds.isEmpty()) {
//            return "SELECT 1 WHERE 1=0";
//        }
//
//        List<Long> cleaned = productIds.stream()
//                .filter(Objects::nonNull)
//                .distinct()
//                .collect(Collectors.toList());
//
//        if (cleaned.isEmpty()) {
//            return "SELECT 1 WHERE 1=0";
//        }
//
//        String inClause = cleaned.stream()
//                .map(String::valueOf)
//                .collect(Collectors.joining(","));
//
//        StringBuilder sb = new StringBuilder();
//
//        sb.append("SELECT ")
//          .append("base.product_id AS productId, ")
//          .append("GREATEST(0, ROUND(")
//          .append("IFNULL(out_stats.max_daily_out,0) * IFNULL(in_stats.max_lt,0) ")
//          .append("- IFNULL(out_stats.avg_daily_out,0) * IFNULL(in_stats.avg_lt,0)")
//          .append(")) AS safetyStock ")
//          .append("FROM ( ")
//          .append("SELECT DISTINCT pr.id AS product_id ")
//          .append("FROM product pr ")
//          .append("WHERE pr.id IN (").append(inClause).append(") ")
//          .append(") base ")
//
//          .append("LEFT JOIN ( ")
//          .append("SELECT t.product_id, ")
//          .append("MAX(t.daily_qty) AS max_daily_out, ")
//          .append("AVG(t.daily_qty) AS avg_daily_out ")
//          .append("FROM ( ")
//          .append("SELECT o.product_id, DATE(o.order_date) AS d, SUM(o.`count`) AS daily_qty ")
//          .append("FROM `orders` o ")
//          .append("WHERE o.status='OUTBOUND_COMPLETE' ")
//          .append("AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) ")
//          .append("GROUP BY o.product_id, DATE(o.order_date) ")
//          .append(") t GROUP BY t.product_id ")
//          .append(") out_stats ON out_stats.product_id = base.product_id ")
//
//          .append("LEFT JOIN ( ")
//          .append("SELECT vi.product_id, ")
//          .append("MAX(IFNULL(o.lead_time,0)) AS max_lt, ")
//          .append("AVG(IFNULL(o.lead_time,0)) AS avg_lt ")
//          .append("FROM `orders` o ")
//          .append("JOIN vendor_item vi ON vi.id = o.vendor_item_id ")
//          .append("WHERE o.status='INBOUND_COMPLETE' ")
//          .append("AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) ")
//          .append("GROUP BY vi.product_id ")
//          .append(") in_stats ON in_stats.product_id = base.product_id");
//
//        return sb.toString();
//    }
    
    public String selectSafeStock(Map<String, Object> p) {
  	  @SuppressWarnings("unchecked")
  	  List<Long> productIds = (List<Long>) p.get("productIds");

  	  if (productIds == null || productIds.isEmpty()) {
  	    return "SELECT 1 WHERE 1=0";
  	  }

  	  String inClause = productIds.stream()
  	      .filter(Objects::nonNull)
  	      .distinct()
  	      .map(String::valueOf)
  	      .collect(Collectors.joining(","));

  	  String sql = """
  	    SELECT
  	      base.product_id AS productId,

  	      out_stats.max_daily_out AS maxOutbound,
  	      out_stats.avg_daily_out AS avgOutbound,

  	      in_stats.max_lt AS maxLeadTime,
  	      in_stats.avg_lt AS avgLeadTime,

  	      GREATEST(
  	        0.0,
  	        ROUND(
  	          (
  	            CAST(IFNULL(out_stats.max_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.max_lt, 0) AS DECIMAL(18,6))
  	            - CAST(IFNULL(out_stats.avg_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.avg_lt, 0) AS DECIMAL(18,6))
  	          ),
  	          1
  	        )
  	      ) AS safetyStock

  	    FROM (
  	      SELECT DISTINCT pr.id AS product_id
  	      FROM product pr
  	      WHERE pr.id IN (%s)
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
  	    """;

  	  return String.format(sql, inClause);
  	}

    // ✅ summary 쿼리도 provider에 같이 두는 게 안정적
    public String selectSummary(Map<String, Object> p) {
        return new SQL(){{
            SELECT(
              "COUNT(DISTINCT o.order_number) AS orderKinds",
              "IFNULL(SUM(o.`count`), 0) AS totalCount",
              "IFNULL(SUM(o.`count` * vi.purchase_price), 0) AS totalPrice"
            );
            FROM("orders o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            JOIN("product pr ON pr.id = vi.product_id");
            applyWhere(this, p);
        }}.toString();
    }
}



