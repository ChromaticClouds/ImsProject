package com.example.ims.features.inbound.mapper;

import java.util.Map;

import org.apache.ibatis.jdbc.SQL;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.InboundPendingSummaryParam;


public class InboundQuerySqlProvider {

    // Pending List
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


    // Completed List

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


    // Order Detail
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


    // Status Update (단건)

    public String markInboundPending() {
        return new SQL(){{
            UPDATE("`order`");
            SET("status = 'INBOUND_PENDING'");
            WHERE("id = #{orderId}");
        }}.toString();
    }

    public String markInboundComplete() {
        //완료 시 order_date = CURDATE()
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

    // Pending Summary

    public String selectPendingSummary(com.example.ims.features.inbound.dto.InboundPendingSummaryParam p) {
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
            JOIN product p ON p.id = vi.product_id
            WHERE o.status = 'INBOUND_PENDING'
              AND o.recieve_date BETWEEN #{from} AND #{to}
            """);

        if (keyword != null && !keyword.trim().isEmpty()) {
            sb.append("""
              AND (
                o.order_number LIKE CONCAT('%', #{keyword}, '%')
                OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
                OR p.name LIKE CONCAT('%', #{keyword}, '%')
                OR p.product_code LIKE CONCAT('%', #{keyword}, '%')
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
              JOIN product p ON p.id = vi.product_id
              WHERE o.status = 'INBOUND_PENDING'
                AND o.recieve_date BETWEEN #{from} AND #{to}
            """);

        if (keyword != null && !keyword.trim().isEmpty()) {
            sb.append("""
              AND (
                o.order_number LIKE CONCAT('%', #{keyword}, '%')
                OR v.vendor_name LIKE CONCAT('%', #{keyword}, '%')
                OR p.name LIKE CONCAT('%', #{keyword}, '%')
                OR p.product_code LIKE CONCAT('%', #{keyword}, '%')
              )
            """);
        }

        sb.append("""
              GROUP BY o.order_number
            ) t
            """);

        return sb.toString();
    }


    // 발주 번호로 매겨진 물품
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

    // -------------------------
    // 입고 대기 상세
    // -------------------------
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

    public String markInboundCompleteByOrderNumber() {
        return new SQL(){{
            UPDATE("`order`");
            SET("status = 'INBOUND_COMPLETE'");
            SET("order_date = CURDATE()");
            WHERE("order_number = #{orderNumber}");
            WHERE("status = 'INBOUND_PENDING'");
        }}.toString();
    }
    
    // 입고 대기 수정 

    

}
