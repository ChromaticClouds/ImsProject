package com.example.ims.features.inbound.mapper;

import java.util.Map;

import org.apache.ibatis.jdbc.SQL;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.InboundPendingSummaryParam;

public class InboundQuerySqlProvider {

    // -------------------------
    // Pending List
    // -------------------------
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
            FROM("`order` o");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.recieve_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }

            ORDER_BY("o.recieve_date ASC, o.id DESC");
        }}.toString();

        return sql + " LIMIT #{size} OFFSET #{offset}";
    }

    public String countPending(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        return new SQL(){{
            SELECT("COUNT(*)");
            FROM("`order` o");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.recieve_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }
        }}.toString();
    }

    // -------------------------
    // Completed List (범위용: 기존)
    // -------------------------
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
            FROM("`order` o");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }

            ORDER_BY("o.order_date DESC, o.id DESC");
        }}.toString();

        return sql + " LIMIT #{size} OFFSET #{offset}";
    }

    public String countCompleted(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        return new SQL(){{
            SELECT("COUNT(*)");
            FROM("`order` o");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_date BETWEEN #{from} AND #{to}");

            if (StringUtils.hasText(keyword)) {
                WHERE("o.order_number LIKE CONCAT('%', #{keyword}, '%')");
            }
        }}.toString();
    }


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
            FROM("`order` o");
            WHERE("o.id = #{orderId}");
        }}.toString();
    }


    public String markInboundPending() {
        return new SQL(){{
            UPDATE("`order`");
            SET("status = 'INBOUND_PENDING'");
            WHERE("id = #{orderId}");
        }}.toString();
    }

    public String markInboundComplete() {
        return new SQL(){{
            UPDATE("`order`");
            SET("status = 'INBOUND_COMPLETE'");
            SET("order_date = CURDATE()");
            WHERE("id = #{orderId}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }

    public String selectStatusSnapshot() {
        return new SQL(){{
            SELECT("o.id AS orderId", "o.status AS status", "o.order_date AS orderDate");
            FROM("`order` o");
            WHERE("o.id = #{orderId}");
        }}.toString();
    }


    public String selectPendingSummary(InboundPendingSummaryParam p) {
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
            FROM `order` o
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

    public String countPendingSummary(InboundPendingSummaryParam p) {
        String keyword = p.getKeyword();

        StringBuilder sb = new StringBuilder();
        sb.append("""
            SELECT COUNT(*) FROM (
              SELECT o.order_number
              FROM `order` o
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
                "p.sale_price AS salePrice"
            );
            FROM("`order` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("product p ON p.id = vi.product_id");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.order_number = #{orderNumber}");
            ORDER_BY("o.id ASC");
        }}.toString();
    }


    public String selectCompletedTodaySummary(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        StringBuilder sb = new StringBuilder();
        sb.append("""
            SELECT
              '입고 완료' AS statusText,
              o.order_number AS orderNumber,
              MIN(o.order_date) AS orderDate,
              MIN(vi.vendor_id) AS vendorId,
              MIN(v.vendor_name) AS vendorName,
              COUNT(*) AS itemCount,
              SUM(o.`count` * vi.purchase_price) AS totalAmount
            FROM `order` o
            JOIN vendor_item vi ON vi.id = o.vendor_item_id
            JOIN vendor v ON v.id = vi.vendor_id
            JOIN product pr ON pr.id = vi.product_id
            WHERE o.status = 'INBOUND_COMPLETE'
              AND o.order_date = CURDATE()
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
            ORDER BY MIN(o.order_date) DESC, o.order_number DESC
            LIMIT #{size} OFFSET #{offset}
            """);

        return sb.toString();
    }

    public String countCompletedTodaySummary(Map<String, Object> p) {
        String keyword = (String) p.get("keyword");

        StringBuilder sb = new StringBuilder();
        sb.append("""
            SELECT COUNT(*) FROM (
              SELECT o.order_number
              FROM `order` o
              JOIN vendor_item vi ON vi.id = o.vendor_item_id
              JOIN vendor v ON v.id = vi.vendor_id
              JOIN product pr ON pr.id = vi.product_id
              WHERE o.status = 'INBOUND_COMPLETE'
                AND o.order_date = CURDATE()
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
            FROM("`order` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("product p ON p.id = vi.product_id");
            WHERE("o.status = 'INBOUND_COMPLETE'");
            WHERE("o.order_number = #{orderNumber}");
            ORDER_BY("o.id ASC");
        }}.toString();
    }


    public String selectPendingDetailHeader() {
        return new SQL(){{
            SELECT(
                "o.order_number AS orderNumber",
                "MIN(o.recieve_date) AS receiveDate",
                "MIN(vi.vendor_id) AS vendorId",
                "MIN(v.vendor_name) AS vendorName"
            );
            FROM("`order` o");
            JOIN("vendor_item vi ON vi.id = o.vendor_item_id");
            JOIN("vendor v ON v.id = vi.vendor_id");
            WHERE("o.status = 'INBOUND_PENDING'");
            WHERE("o.order_number = #{orderNumber}");
            GROUP_BY("o.order_number");
        }}.toString();
    }

    public String updateReceiveDateByOrderNumber(Map<String, Object> p) {
        return new SQL(){{
            UPDATE("`order`");
            SET("recieve_date = #{receiveDate}");
            WHERE("order_number = #{orderNumber}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }

    public String updateOrderQty(Map<String, Object> p) {
        return new SQL(){{
            UPDATE("`order`");
            SET("`count` = #{orderQty}");
            WHERE("id = #{orderId}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }
    
    public String selectOrdersForInboundCompleteByOrderNumber(Map<String, Object> p) {
        return """
            SELECT
              o.user_id AS userId,
              o.vendor_item_id AS vendorItemId,
              o.`count` AS orderQty
            FROM `order` o
            WHERE o.order_number = #{orderNumber}
              AND o.status = 'INBOUND_PENDING'
            ORDER BY o.id ASC
            """;
    }

    // 2) 해당 vendor_item의 최신 재고
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

    // 3) history insert
    public String insertHistoryRow() {
        return """
            INSERT INTO history
              (status, user_id, vendor_item_id, before_count, after_count, created_at)
            VALUES
              (#{status}, #{userId}, #{vendorItemId}, #{beforeCount}, #{afterCount}, NOW())
            """;
    }

    // 4) 주문 상태 완료
    public String markInboundCompleteByOrderNumber() {
        return """
            UPDATE `order`
            SET status = 'INBOUND_COMPLETE',
                order_date = CURDATE()
            WHERE order_number = #{orderNumber}
              AND status = 'INBOUND_PENDING'
            """;
    }
    
    // 5) stock upsert (product_id 기준 누적) --> 이건 잘 몰랐음. upsert가 일부러 충돌시켜서 product_id가 같으면 update 아니면 insert
    public String upsertStockByProductId(Map<String, Object> p) {
        // delta = afterCount - beforeCount (입고면 양수)
        return """
            INSERT INTO stock (product_id, `count`)
            VALUES (#{productId}, #{delta})
            ON DUPLICATE KEY UPDATE `count` = `count` + VALUES(`count`)
            """;
    }
    
    public String selectProductIdByVendorItemId(Map<String, Object> p) {
        return """
            SELECT vi.product_id
            FROM vendor_item vi
            WHERE vi.id = #{vendorItemId}
            """;
    }
    
    
    
    
    
}


