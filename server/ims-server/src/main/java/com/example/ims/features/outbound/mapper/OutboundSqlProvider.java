package com.example.ims.features.outbound.mapper;

import java.util.Map;

public class OutboundSqlProvider {

  public String selectOutboundAssignees(Map<String, Object> p) {
    return """
      SELECT
        u.id AS id,
        u.eid AS eid,
        u.name AS name
      FROM `user` u
      WHERE u.status = 'ACTIVE'
        AND (
          u.user_rank IN ('FIRST_ADMIN', 'SECOND_ADMIN')
          OR (u.user_rank = 'EMPLOYEE' AND u.user_role = 'OUTBOUND')
        )
      ORDER BY u.name ASC, u.eid ASC
    """;
  }

  // 출고 대기 summary 
  public String selectPendingSummary(Map<String, Object> p) {
    Object userId = p.get("userId");

    StringBuilder sb = new StringBuilder();
    sb.append("""
      SELECT
        'OUTBOUND_PENDING' AS status,
        CASE WHEN MIN(o.recieve_date) < CURDATE() THEN '미납' ELSE '출고 대기' END AS statusText,
        o.order_number AS orderNumber,
        MIN(o.recieve_date) AS receiveDate,
        MIN(o.seller_vendor_id) AS sellerVendorId,
        MIN(v.vendor_name) AS sellerVendorName,
        COUNT(*) AS itemCount,
        SUM(o.`count` * pr.sale_price) AS totalAmount,
        MIN(o.user_id) AS userId,
        MIN(u.name) AS userName,
        MAX(CASE WHEN o.`count` > IFNULL(s.`count`, 0) THEN 1 ELSE 0 END) AS hasShortage
      FROM `order` o
      JOIN vendor v ON v.id = o.seller_vendor_id
      JOIN product pr ON pr.id = o.product_id
      LEFT JOIN stock s ON s.product_id = o.product_id
      LEFT JOIN `user` u ON u.id = o.user_id
      WHERE o.status = 'OUTBOUND_PENDING'
        AND o.recieve_date BETWEEN #{from} AND #{to}
    """);

    if (userId != null) {
      sb.append("""
        AND o.user_id = #{userId}
      """);
    }

    sb.append("""
      GROUP BY o.order_number
      ORDER BY MIN(o.recieve_date) ASC, o.order_number DESC
      LIMIT #{size} OFFSET #{offset}
    """);

    return sb.toString();
  }

  public String countPendingSummary(Map<String, Object> p) {
    Object userId = p.get("userId");

    StringBuilder sb = new StringBuilder();
    sb.append("""
      SELECT COUNT(*) FROM (
        SELECT o.order_number
        FROM `order` o
        WHERE o.status = 'OUTBOUND_PENDING'
          AND o.recieve_date BETWEEN #{from} AND #{to}
    """);

    if (userId != null) {
      sb.append("""
          AND o.user_id = #{userId}
      """);
    }

    sb.append("""
        GROUP BY o.order_number
      ) t
    """);

    return sb.toString();
  }

  public String selectPendingItemsByOrderNumber(Map<String, Object> p) {
	  return """
    SELECT
      o.id AS orderId,
      o.product_id AS productId,
      pr.name AS productName,
      pr.type AS type,
      pr.brand AS brand,
      o.`count` AS orderQty,
      IFNULL(s.`count`, 0) AS stockCount,
      CASE WHEN o.`count` > IFNULL(s.`count`, 0) THEN 1 ELSE 0 END AS shortage,
      pr.sale_price AS salePrice
    FROM `order` o
    JOIN product pr ON pr.id = o.product_id
    LEFT JOIN stock s ON s.product_id = o.product_id
    WHERE o.status = 'OUTBOUND_PENDING'
      AND o.order_number = #{orderNumber}
    ORDER BY o.id ASC
  """; }

  public String selectCompletedTodaySummary(Map<String, Object> p) { 
	  return """
    SELECT
      'OUTBOUND_COMPLETE' AS status,
      '출고 완료' AS statusText,
      o.order_number AS orderNumber,
      MIN(o.order_date) AS orderDate,
      MIN(o.seller_vendor_id) AS sellerVendorId,
      MIN(v.vendor_name) AS sellerVendorName,
      COUNT(*) AS itemCount,
      SUM(o.`count` * pr.sale_price) AS totalAmount,
      MIN(o.user_id) AS userId,
      MIN(u.name) AS userName
    FROM `order` o
    JOIN vendor v ON v.id = o.seller_vendor_id
    JOIN product pr ON pr.id = o.product_id
    LEFT JOIN `user` u ON u.id = o.user_id
    WHERE o.status = 'OUTBOUND_COMPLETE'
      AND o.order_date = CURDATE()
    GROUP BY o.order_number
    ORDER BY MIN(o.order_date) DESC, o.order_number DESC
    LIMIT #{size} OFFSET #{offset}
  """; }

  public String countCompletedTodaySummary() { 
	  return """
    SELECT COUNT(*) FROM (
      SELECT o.order_number
      FROM `order` o
      WHERE o.status = 'OUTBOUND_COMPLETE'
        AND o.order_date = CURDATE()
      GROUP BY o.order_number
    ) t
  """; }

  public String selectCompletedItemsByOrderNumber(Map<String, Object> p) { 
	  return """
    SELECT
      o.id AS orderId,
      o.product_id AS productId,
      pr.name AS productName,
      pr.type AS type,
      pr.brand AS brand,
      o.`count` AS orderQty,
      pr.sale_price AS salePrice
    FROM `order` o
    JOIN product pr ON pr.id = o.product_id
    WHERE o.status = 'OUTBOUND_COMPLETE'
      AND o.order_number = #{orderNumber}
    ORDER BY o.id ASC
  """; }

  public String selectOrdersForOutboundComplete(Map<String, Object> p) { 
	  return """
    SELECT
      o.id AS orderId,
      o.user_id AS userId,
      o.product_id AS productId,
      o.`count` AS orderQty
    FROM `order` o
    WHERE o.order_number = #{orderNumber}
      AND o.status = 'OUTBOUND_PENDING'
    ORDER BY o.id ASC
  """; }

  public String selectStockCountForUpdate() { 
	  return """
    SELECT s.`count`
    FROM stock s
    WHERE s.product_id = #{productId}
    FOR UPDATE
  """; }

  public String upsertStockByDelta() { 
	  return """
    INSERT INTO stock (product_id, `count`)
    VALUES (#{productId}, #{delta})
    ON DUPLICATE KEY UPDATE
      `count` = `count` + #{delta}
  """; }

  public String insertHistoryOutbound() { 
	  return """
    INSERT INTO history
      (lot_id, vendor_item_id, product_id, before_count, after_count, created_at)
    VALUES
      (NULL, NULL, #{productId}, #{beforeCount}, #{afterCount}, NOW())
  """; }

  public String markOutboundCompleteByOrderNumber() { 
	  return """
    UPDATE `order`
    SET status = 'OUTBOUND_COMPLETE',
        order_date = CURDATE()
    WHERE order_number = #{orderNumber}
      AND status = 'OUTBOUND_PENDING'
  """; }

  public String insertHistoryLot() { 
	  return """
	INSERT INTO history_lot (user_id, status, memo)
    VALUES (#{userId}, 'OUTBOUND', #{memo})
  """; }
  
  
  public String selectStockTypes(Map<String, Object> p) {
	  return """
	  		SELECT DISTINCT p.type
	  		FROM product p
	  		WHERE p.type IS NOT NULL
	  		ORDER BY p.type ASC
	  		""";
  }
  
  public String selectStockBrandsByType(Map<String, Object> p) {
	  return """
	  		SELECT DISTINCT p.brand
	  		FROM product p
	  		WHERE p.type = #{type}
	  		AND p.brand IS NOT NULL
	  		ORDER BY p.brand ASC
	  		""";
  }
  
  public String selectStockProducts(Map<String, Object> p) {
	  return """
	  		SELECT
	  		p.id AS id,
	  		p.product_code AS productCode,
	  		p.name AS name,
	  		p.type AS type,
	  		p.brand AS brand,
	  		p.volume AS volume,
	  		IFNULL(s.`count`, 0) AS stockCount
	  		FROM product p
	  		LEFT JOIN stock s ON s.product_id = p.id
	  		WHERE p.type = #{type}
	  		AND p.brand = #{brand}
	  		ORDER BY p.name ASC, p.id ASC
	  		""";
  }
  
  
  
  
}









