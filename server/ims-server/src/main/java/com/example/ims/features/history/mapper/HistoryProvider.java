package com.example.ims.features.history.mapper;

import java.util.Map;
import org.apache.ibatis.jdbc.SQL;
import org.springframework.util.StringUtils;

public class HistoryProvider {

  public String selectLotSummaries(Map<String, Object> p) {
    String status = (String) p.get("status");
    String type = (String) p.get("type");
    String brand = (String) p.get("brand");
    String kind = (String) p.get("kind");
    Object targetId = p.get("targetId");
    String q = (String) p.get("q");

    // 상태 이름 변경, 계산(종류 갯수, 변동수량), history_lot, history, user, vendor, product join 필요
    // 날짜, 상태, 주종, 브랜드
    String base = """
      SELECT
        hl.id AS lotId,
        hl.status AS status,
        CASE hl.status
          WHEN 'INBOUND' THEN '입고'
          WHEN 'OUTBOUND' THEN '출고'
          ELSE '조정'
        END AS statusText,
        MAX(h.created_at) AS createdAt,
        hl.user_id AS userId,
        u.name AS userName,

        COUNT(DISTINCT h.product_id) AS itemCount,
        SUM(h.after_count - h.before_count) AS totalDelta,

        MIN(vi.vendor_id) AS vendorId,
        MIN(v_in.vendor_name) AS vendorName,

        MIN(h.seller_vendor_id) AS sellerVendorId,
        MIN(v_out.vendor_name) AS sellerVendorName
      FROM history_lot hl
      JOIN history h ON h.lot_id = hl.id
      LEFT JOIN `user` u ON u.id = hl.user_id
      LEFT JOIN vendor_item vi ON vi.id = h.vendor_item_id
      LEFT JOIN vendor v_in ON v_in.id = vi.vendor_id
      LEFT JOIN vendor v_out ON v_out.id = h.seller_vendor_id
      JOIN product pr ON pr.id = h.product_id
      WHERE 1=1
    """;

    StringBuilder sb = new StringBuilder(base);

    sb.append(" AND DATE(h.created_at) BETWEEN #{from} AND #{to}\n");

    if (StringUtils.hasText(status)) {
      sb.append(" AND hl.status = #{status}\n");
    }
    if (StringUtils.hasText(type)) {
      sb.append(" AND pr.type = #{type}\n");
    }
    if (StringUtils.hasText(brand)) {
      sb.append(" AND pr.brand = #{brand}\n");
    }

    if (StringUtils.hasText(kind) && targetId != null) {
      if ("PRODUCT".equals(kind)) sb.append(" AND h.product_id = #{targetId}\n");
      else if ("USER".equals(kind)) sb.append(" AND hl.user_id = #{targetId}\n");
      else if ("VENDOR".equals(kind)) {
        sb.append(" AND (vi.vendor_id = #{targetId} OR h.seller_vendor_id = #{targetId})\n");
      }
    }

    if (StringUtils.hasText(q)) {
      sb.append("""
        AND (
          pr.name LIKE CONCAT('%', #{q}, '%')
          OR u.name LIKE CONCAT('%', #{q}, '%')
          OR v_in.vendor_name LIKE CONCAT('%', #{q}, '%')
          OR v_out.vendor_name LIKE CONCAT('%', #{q}, '%')
        )
      """);
    }

    sb.append("""
      GROUP BY hl.id, hl.status, hl.user_id, u.name
      ORDER BY MAX(h.created_at) DESC
      LIMIT #{size} OFFSET #{offset}
    """);

    return sb.toString();
  }

  public String countLotSummaries(Map<String, Object> p) {
    return """
      SELECT COUNT(*) FROM (
        SELECT hl.id
        FROM history_lot hl
        JOIN history h ON h.lot_id = hl.id
        JOIN product pr ON pr.id = h.product_id
        LEFT JOIN `user` u ON u.id = hl.user_id
        LEFT JOIN vendor_item vi ON vi.id = h.vendor_item_id
        LEFT JOIN vendor v_in ON v_in.id = vi.vendor_id
        LEFT JOIN vendor v_out ON v_out.id = h.seller_vendor_id
        WHERE 1=1
          AND DATE(h.created_at) BETWEEN #{from} AND #{to}
          AND (#{status} IS NULL OR #{status} = '' OR hl.status = #{status})
          AND (#{type}   IS NULL OR #{type}   = '' OR pr.type = #{type})
          AND (#{brand}  IS NULL OR #{brand}  = '' OR pr.brand = #{brand})
          AND (
            #{kind} IS NULL OR #{kind} = '' OR #{targetId} IS NULL
            OR (
              (#{kind}='PRODUCT' AND h.product_id = #{targetId})
              OR (#{kind}='USER' AND hl.user_id = #{targetId})
              OR (#{kind}='VENDOR' AND (vi.vendor_id = #{targetId} OR h.seller_vendor_id = #{targetId}))
            )
          )
          AND (
            #{q} IS NULL OR #{q} = '' OR (
              pr.name LIKE CONCAT('%', #{q}, '%')
              OR u.name LIKE CONCAT('%', #{q}, '%')
              OR v_in.vendor_name LIKE CONCAT('%', #{q}, '%')
              OR v_out.vendor_name LIKE CONCAT('%', #{q}, '%')
            )
          )
        GROUP BY hl.id
      ) t
    """;
  }


  public String selectBrandsByType() {
    return """
      SELECT DISTINCT pr.brand
      FROM product pr
      WHERE pr.type = #{type}
        AND pr.brand IS NOT NULL
        AND pr.brand <> ''
      ORDER BY pr.brand ASC
    """;
  }

  public String searchSuggestions() {
    return """
      (
        SELECT 'PRODUCT' AS kind, pr.id AS id,
               CONCAT(pr.name, IFNULL(CONCAT(' ', pr.volume), '')) AS label
        FROM product pr
        WHERE pr.name LIKE CONCAT('%', #{q}, '%')
        ORDER BY pr.name ASC
        LIMIT #{limit}
      )
      UNION ALL
      (
        SELECT 'USER' AS kind, u.id AS id, u.name AS label
        FROM `user` u
        WHERE u.name LIKE CONCAT('%', #{q}, '%')
        ORDER BY u.name ASC
        LIMIT #{limit}
      )
      UNION ALL
      (
        SELECT 'VENDOR' AS kind, v.id AS id, v.vendor_name AS label
        FROM vendor v
        WHERE v.vendor_name LIKE CONCAT('%', #{q}, '%')
        ORDER BY v.vendor_name ASC
        LIMIT #{limit}
      )
      LIMIT #{limit}
    """;
  }
  
}



