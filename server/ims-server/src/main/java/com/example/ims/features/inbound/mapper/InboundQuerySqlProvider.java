package com.example.ims.features.inbound.mapper;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.ibatis.jdbc.SQL;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.InboundSummaryParam;

public class InboundQuerySqlProvider {

    // 입고 대기 목록
    public String selectPendingList(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        String sql = new SQL(){{
            SELECT(
                "o.id",
                "o.user_id AS userId",
                "o.order_number AS orderNumber",
                "o.order_date AS orderDate",
                "o.recieve_date AS receiveDate",
                "o.`count` AS qty",
                "o.status",
                "o.vendor_item_id AS vendorItemId"
            );
            FROM("`orders` o");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.recieve_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }

            ORDER_BY("o.recieve_date ASC, o.id DESC");
        }}.toString();

        return sql + " LIMIT #{size} OFFSET #{offset}";
    }

    // 입고 대기 수량
    public String countPending(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        return new SQL(){{
            SELECT("COUNT(*)");
            FROM("`orders` o");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.recieve_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }
        }}.toString();
    }

    // 입고 완료 내역
    public String selectCompletedList(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        String sql = new SQL(){{
            SELECT(
                "o.id",
                "o.user_id AS userId",
                "o.order_number AS orderNumber",
                "o.order_date AS orderDate",
                "o.recieve_date AS receiveDate",
                "o.`count` AS qty",
                "o.status",
                "o.vendor_item_id AS vendorItemId"
            );
            FROM("`orders` o");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }

            ORDER_BY("o.order_date DESC, o.id DESC");
        }}.toString();

        return sql + " LIMIT #{size} OFFSET #{offset}";
    }

    // 입고 완료 수량
    public String countCompleted(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        return new SQL(){{
            SELECT("COUNT(*)");
            FROM("`orders` o");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }
        }}.toString();
    }

    // 입고 품목 상세
    public String selectOrderDetail() {
        return new SQL(){{
            SELECT(
                "o.id",
                "o.user_id AS userId",
                "o.order_number AS orderNumber",
                "o.order_date AS orderDate",
                "o.recieve_date AS receiveDate",
                "o.`count` AS qty",
                "o.lead_time AS leadTime",
                "o.status",
                "o.vendor_item_id AS vendorItemId"
            );
            FROM("`orders` o");
            WHERE("o.id = #{orderId}");
        }}.toString();
    }

    // 입고 대기
    public String markInboundPending() {
        return new SQL(){{
            UPDATE("`orders`");
            SET("status = 'INBOUND_PENDING'");
            WHERE("id = #{orderId}");
        }}.toString();
    }

    // 입고 완료
    public String markInboundComplete() {
        return new SQL(){{
            UPDATE("`orders`");
            SET("status = 'INBOUND_COMPLETE'");
            SET("order_date = CURDATE()");
            WHERE("id = #{orderId}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }

    // 입고 상태 
    public String selectStatusSnapshot() {
        return new SQL(){{
            SELECT("o.id AS orderId", "o.status AS status", "o.order_date AS orderDate");
            FROM("`orders` o");
            WHERE("o.id = #{orderId}");
        }}.toString();
    }

    // 입고 대기 내역
    public String selectPendingSummary(InboundSummaryParam p) {
        String keyword = p.getKeyword();

        StringBuilder sb = new StringBuilder();
        sb.append("""
            SELECT
              '입고 대기' AS statusText,
              o.order_number AS orderNumber,
              MIN(o.recieve_date) AS receiveDate,
              MIN(vi.vendor_id) AS vendorId,
              MIN(v.vendor_name) AS vendorName,
              COUNT(*) AS itemCount,
              SUM(o.`count` * vi.purchase_price) AS totalAmount
            FROM `orders` o
            JOIN vendor_item vi ON vi.id = o.vendor_item_id
            JOIN vendor v ON v.id = vi.vendor_id
            JOIN product pr ON pr.id = vi.product_id
            WHERE o.status = 'INBOUND_PENDING'
              AND o.recieve_date BETWEEN #{from} AND #{to}
            """);

        if (StringUtils.hasText(keyword)) {
            sb.append("""
              AND (
                o.order_number LIKE CONCAT('%', #{keyword}, '%')
                OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
                OR pr.name LIKE CONCAT('%', #{keyword}, '%')
                OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
              )
            """);
        }

        sb.append("""
            GROUP BY o.order_number
            ORDER BY MIN(o.recieve_date) ASC, o.order_number DESC
            LIMIT #{size} OFFSET #{offset}
            """);

        return sb.toString();
    }

    // 입고 대기 수량 내역
    public String countPendingSummary(InboundSummaryParam p) {
        String keyword = p.getKeyword();

        StringBuilder sb = new StringBuilder();
        sb.append("""
            SELECT COUNT(*) FROM (
              SELECT o.order_number
              FROM `orders` o
              JOIN vendor_item vi ON vi.id = o.vendor_item_id
              JOIN vendor v ON v.id = vi.vendor_id
              JOIN product pr ON pr.id = vi.product_id
              WHERE o.status = 'INBOUND_PENDING'
                AND o.recieve_date BETWEEN #{from} AND #{to}
            """);

        if (StringUtils.hasText(keyword)) {
            sb.append("""
              AND (
                o.order_number LIKE CONCAT('%', #{keyword}, '%')
                OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
                OR pr.name LIKE CONCAT('%', #{keyword}, '%')
                OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
              )
            """);
        }

        sb.append("""
              GROUP BY o.order_number
            ) t
            """);

        return sb.toString();
    }

    // 입고 대기 물품(주문번호 별로)
//    public String selectPendingItemsByOrderNumber(Map<String, Object> params) {
//        return new SQL() {{
//            SELECT(
//                "o.id AS orderId",
//                "o.vendor_item_id AS vendorItemId",
//                "vi.product_id AS productId",
//                "p.name AS productName",
//                "p.type AS type",
//                "p.brand AS brand",
//                "o.`count` AS orderQty",
//                "vi.purchase_price AS purchasePrice",
//                "(o.`count` * vi.purchase_price) AS lineAmount",
//                "p.image_url AS imageUrl",
//                "p.sale_price AS salePrice"
//            );
//            FROM("`orders` o");
//            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
//            JOIN("product p ON p.id = vi.product_id");
//            WHERE("o.status = 'INBOUND_PENDING'");
//            WHERE("o.order_number = #{orderNumber}");
//            ORDER_BY("o.id ASC");
//        }}.toString();
//    }
    
    public String selectPendingItemsByOrderNumber(Map<String, Object> params) {
        return new SQL() {{
            SELECT(
                "o.id AS orderId",
                "o.vendor_item_id AS vendorItemId",
                "vi.product_id AS productId",
                "p.name AS productName",
                "p.type AS type",
                "p.brand AS brand",
                "o.`count` AS orderQty",
                "vi.purchase_price AS purchasePrice",
                "(o.`count` * vi.purchase_price) AS lineAmount",
                "p.image_url AS imageUrl",
                "p.sale_price AS salePrice",
                // ⭐ 여기 추가 (현재고)
                "IFNULL(s.`count`, 0) AS currentStock"
            );
            FROM("`orders` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("product p ON p.id = vi.product_id");
            // ⭐ 여기 추가 (stock 조인)
            LEFT_OUTER_JOIN("stock s ON s.product_id = vi.product_id");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.order_number = #{orderNumber}");
            ORDER_BY("o.id ASC");
        }}.toString();
    }

 // 금일 입고 완료 내역
    public String selectCompletedTodaySummary(Map<String, Object> p) {
      String keyword = (String) p.get("keyword");

      StringBuilder sb = new StringBuilder();
      sb.append("""
          SELECT
            '입고 완료' AS statusText,
            o.order_number AS orderNumber,
            MIN(o.order_date) AS orderDate,
            MIN(o.recieve_date) AS receiveDate,
            MIN(vi.vendor_id) AS vendorId,
            MIN(v.vendor_name) AS vendorName,
            COUNT(*) AS itemCount,
            SUM(o.`count` * vi.purchase_price) AS totalAmount,
            MAX(o.qty_changed) AS qtyChanged
          FROM `orders` o
          JOIN vendor_item vi ON vi.id = o.vendor_item_id
          JOIN vendor v ON v.id = vi.vendor_id
          JOIN product pr ON pr.id = vi.product_id
          WHERE o.status = 'INBOUND_COMPLETE'
            AND DATE(o.recieve_date) = CURDATE()
          """);

      if (StringUtils.hasText(keyword)) {
        sb.append("""
            AND (
              o.order_number LIKE CONCAT('%', #{keyword}, '%')
              OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
              OR pr.name LIKE CONCAT('%', #{keyword}, '%')
              OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
            )
          """);
      }

      sb.append("""
          GROUP BY o.order_number
          ORDER BY MAX(o.recieve_date) DESC, o.order_number DESC
          LIMIT #{size} OFFSET #{offset}
          """);

      return sb.toString();
    }


    // 금일 입고 완료 내역 수량  
    public String countCompletedTodaySummary(Map<String, Object> p) {
    	  String keyword = (String) p.get("keyword");

    	  StringBuilder sb = new StringBuilder();
    	  sb.append("""
    	      SELECT COUNT(*) FROM (
    	        SELECT o.order_number
    	        FROM `orders` o
    	        JOIN vendor_item vi ON vi.id = o.vendor_item_id
    	        JOIN vendor v ON v.id = vi.vendor_id
    	        JOIN product pr ON pr.id = vi.product_id
    	        WHERE o.status = 'INBOUND_COMPLETE'
    	          AND DATE(o.recieve_date) = CURDATE()
    	      """);

    	  if (StringUtils.hasText(keyword)) {
    	    sb.append("""
    	        AND (
    	          o.order_number LIKE CONCAT('%', #{keyword}, '%')
    	          OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
    	          OR pr.name LIKE CONCAT('%', #{keyword}, '%')
    	          OR pr.product_code LIKE CONCAT('%', #{keyword}, '%')
    	        )
    	      """);
    	  }

    	  sb.append("""
    	        GROUP BY o.order_number
    	      ) t
    	      """);

    	  return sb.toString();
    	}


    // 입고 완료 (발주번호 별로)
    public String selectCompletedItemsByOrderNumber(Map<String, Object> params) {
        return new SQL() {{
            SELECT(
                "o.id AS orderId",
                "o.vendor_item_id AS vendorItemId",
                "vi.product_id AS productId",
                "p.name AS productName",
                "p.type AS type",
                "p.brand AS brand",
                "o.`count` AS orderQty",
                "vi.purchase_price AS purchasePrice",
                "(o.`count` * vi.purchase_price) AS lineAmount",
                "p.image_url AS imageUrl",
                "p.sale_price AS salePrice"
            );
            FROM("`orders` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("product p ON p.id = vi.product_id");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_number = #{orderNumber}");
            ORDER_BY("o.id ASC");
        }}.toString();
    }

    // 입고 대기 상세 헤더
    public String selectPendingDetailHeader() {
        return new SQL(){{
            SELECT(
                "o.order_number AS orderNumber",
                "MIN(o.recieve_date) AS receiveDate",
                "MIN(vi.vendor_id) AS vendorId",
                "MIN(v.vendor_name) AS vendorName"
            );
            FROM("`orders` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.order_number = #{orderNumber}");
            GROUP_BY("o.order_number");
        }}.toString();
    }

    
    // 입고 수정 (발주번호 별로)
    public String updateReceiveDateByOrderNumber(Map<String, Object> p) {
        return new SQL(){{
            UPDATE("`orders`");
            SET("recieve_date = #{receiveDate}");
            WHERE("order_number = #{orderNumber}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }

    // 입고 수정 수량
//    public String updateOrderQty(Map<String, Object> p) {
//        return new SQL(){{
//            UPDATE("`orders`");
//            SET("`count` = #{orderQty}");
//            WHERE("id = #{orderId}");
//            WHERE("status = 'INBOUND_PENDING'");
//        }}.toString();
//    }
    
    public String updateOrderQty(Map<String, Object> p) {
    	  return new SQL(){{
    	    UPDATE("`orders`");
    	    // ✅ 기존 count와 다르면 1로 고정
    	    SET("qty_changed = CASE WHEN `count` <> #{orderQty} THEN 1 ELSE qty_changed END");
    	    SET("`count` = #{orderQty}");
    	    WHERE("id = #{orderId}");
    	    WHERE("status = 'INBOUND_PENDING'");
    	  }}.toString();
    	}

    // 발주번호별로 입고 완료 
    public String selectOrdersForInboundCompleteByOrderNumber(Map<String, Object> p) {
        return """
            SELECT
              o.user_id AS userId,
              o.vendor_item_id AS vendorItemId,
              o.`count` AS orderQty
            FROM `orders` o
            WHERE o.order_number = #{orderNumber}
              AND o.status = 'INBOUND_PENDING'
            ORDER BY o.id ASC
        """;
    }

    // 입고 수정 후에 내역
    public String selectLatestAfterCountForUpdate(Map<String, Object> p) {
        return """
            SELECT h.after_count
            FROM history h
            WHERE h.vendor_item_id = #{vendorItemId}
            ORDER BY h.created_at DESC, h.id DESC
            LIMIT 1
            FOR UPDATE
        """;
    }

    // 히스토리 추가
    public String insertHistoryRow() {
        return """
            INSERT INTO history
              (lot_id, vendor_item_id, product_id, before_count, after_count, created_at)
            VALUES
              (#{lotId}, #{vendorItemId}, #{productId}, #{beforeCount}, #{afterCount}, NOW())
        """;
    }

    // 발주번호 별로 입고 완료
    public String markInboundCompleteByOrderNumber() {
    	  return """
    	    UPDATE `orders` o
    	  	SET
    	  	o.status = 'INBOUND_COMPLETE',
    	  	o.recieve_date = CURDATE(),
    	  	o.manager_id = #{loginUserId},   -- 👈 추가
    	    o.lead_time = GREATEST(0, DATEDIFF(CURDATE(), DATE(o.order_date)))
    	    WHERE o.order_number = #{orderNumber}
    	  	AND o.status = 'INBOUND_PENDING'
    	  """;
    	}



    // product_id 별로 stock upsert
    public String upsertStockByProductId(Map<String, Object> p) {
        return """
            INSERT INTO stock (product_id, `count`)
            VALUES (#{productId}, #{delta})
            ON DUPLICATE KEY UPDATE `count` = `count` + VALUES(`count`)
        """;
    }

    // vendorItemID 별로 제품
    public String selectProductIdByVendorItemId(Map<String, Object> p) {
        return """
            SELECT vi.product_id
            FROM vendor_item vi
            WHERE vi.id = #{vendorItemId}
        """;
    }
    
    // 안전재고
//    public String selectSafeStock(Map<String, Object> p) {
//    	  @SuppressWarnings("unchecked")
//    	  List<Long> productIds = (List<Long>) p.get("productIds");
//
//    	  if (productIds == null || productIds.isEmpty()) {
//    	    // 빈 배열이면 결과도 빈 배열로
//    	    return "SELECT 1 WHERE 1=0";
//    	  }
//
//    	  String inClause = productIds.stream()
//    	      .filter(Objects::nonNull)
//    	      .map(String::valueOf)
//    	      .collect(Collectors.joining(","));
//
//    	  return """
//    	    SELECT
//    	      base.product_id AS productId,
//    	      GREATEST(
//    	        0,
//    	        ROUND(
//    	          IFNULL(out_stats.max_daily_out, 0) * IFNULL(in_stats.max_lt, 0)
//    	          - IFNULL(out_stats.avg_daily_out, 0) * IFNULL(in_stats.avg_lt, 0)
//    	        )
//    	      ) AS safetyStock
//    	    FROM (
//    	      SELECT DISTINCT pr.id AS product_id
//    	      FROM product pr
//    	      WHERE pr.id IN (""" + inClause + """
//    	      )
//    	    ) base
//    	    LEFT JOIN (
//    	      SELECT
//    	        t.product_id,
//    	        MAX(t.daily_qty) AS max_daily_out,
//    	        AVG(t.daily_qty) AS avg_daily_out
//    	      FROM (
//    	        SELECT
//    	          o.product_id,
//    	          DATE(o.order_date) AS d,
//    	          SUM(o.`count`) AS daily_qty
//    	        FROM `orders` o
//    	        WHERE o.status = 'OUTBOUND_COMPLETE'
//    	          AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
//    	        GROUP BY o.product_id, DATE(o.order_date)
//    	      ) t
//    	      GROUP BY t.product_id
//    	    ) out_stats ON out_stats.product_id = base.product_id
//    	    LEFT JOIN (
//    	      SELECT
//    	        vi.product_id,
//    	        MAX(IFNULL(o.lead_time, 0)) AS max_lt,
//    	        AVG(IFNULL(o.lead_time, 0)) AS avg_lt
//    	      FROM `orders` o
//    	      JOIN vendor_item vi ON vi.id = o.vendor_item_id
//    	      WHERE o.status = 'INBOUND_COMPLETE'
//    	        AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
//    	      GROUP BY vi.product_id
//    	    ) in_stats ON in_stats.product_id = base.product_id
//    	  """;
//    	}
    
    
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
    	        CEIL(
    	          (
    	            CAST(IFNULL(out_stats.max_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.max_lt, 0) AS DECIMAL(18,6))
    	            - CAST(IFNULL(out_stats.avg_daily_out, 0) AS DECIMAL(18,6)) * CAST(IFNULL(in_stats.avg_lt, 0) AS DECIMAL(18,6))
    	          )
    	          
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

    
}



























