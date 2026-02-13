package com.example.ims.features.vendor.mapper;

import java.util.Map;

import com.example.ims.features.vendor.dto.VendorCreateRequest;
import org.apache.ibatis.jdbc.SQL;
import org.springframework.data.repository.query.Param;

public class VendorSqlProvider {
    

	// 거래처 리스트
    public String findVendorList(Map<String, Object> params) {

        String type = (String) params.get("type");
        String keyword = (String) params.get("keyword");

        return new SQL() {{
            SELECT("id, type, vendor_name AS vendorName, telephone, email, address");
            FROM("vendor");
            WHERE("status = 'ACTIVE'");
            
            if (type != null) WHERE("type = #{type}");
            if (keyword != null) WHERE("vendor_name LIKE CONCAT('%', #{keyword}, '%')");
        
            ORDER_BY("id DESC");
        }}.toString()
        
        + " LIMIT ${limit} OFFSET ${offset}";
    }
    
    // 거래처 수량 
    public String countVendorList(Map<String, Object> params) {

        String type = (String) params.get("type");
        String keyword = (String) params.get("keyword");

        return new SQL() {{
            SELECT("COUNT(*)");
            FROM("vendor");
            WHERE("status = 'ACTIVE'");

            if (type != null) WHERE("type = #{type}");
            if (keyword != null) WHERE("vendor_name LIKE CONCAT('%', #{keyword}, '%')");
        }}.toString();
    }
    
    // 거래처 등록
    public String insertVendor() {
        return new SQL(){{
            INSERT_INTO("vendor");
            VALUES("type", "#{type}");
            VALUES("vendor_name", "#{vendorName}");
            VALUES("telephone", "#{telephone}");
            VALUES("email", "#{email}");
            VALUES("boss_name", "#{bossName}");
            VALUES("address", "#{address}");
            VALUES("memo", "#{memo}");
            VALUES("status", "'ACTIVE'");
            VALUES("created_at", "NOW()");
        }}.toString();
    }
    
    // 거래처에 따른 수량 등록
    public String insertVendorItems(Map<String, Object> params) {
        return """
        <script>
          INSERT INTO vendor_item (product_id, vendor_id, purchase_price)
          VALUES
          <foreach collection="items" item="it" separator=",">
            (#{it.productId}, #{vendorId}, #{it.purchasePrice})
          </foreach>
        </script>
        """;
    }
    
    // 제품 검색
    public String searchProducts(Map<String, Object> params) {
        String keyword = (String) params.get("keyword");
        Boolean excludeAssigned = (Boolean) params.get("excludeAssigned");
        Long currentVendorId = (Long) params.get("currentVendorId");

        return new SQL() {{
            SELECT("p.id, p.name");
            FROM("product p");

            if (keyword != null && !keyword.isEmpty()) {
                WHERE("p.name LIKE CONCAT('%', #{keyword}, '%')");
            }

            if (excludeAssigned != null && excludeAssigned) {
                if (currentVendorId != null) {
                    // ✅ 다른 거래처에 할당된 것만 제외 (현재 거래처는 예외)
                    WHERE("""
                        NOT EXISTS (
                            SELECT 1
                            FROM vendor_item vi
                            JOIN vendor v ON v.id = vi.vendor_id
                            WHERE vi.product_id = p.id
                              AND vi.status = 'ACTIVE'
                              AND v.status = 'ACTIVE'
                              AND vi.vendor_id <> #{currentVendorId}
                        )
                    """);
                } else {
                    // 기존 로직 유지 (등록 페이지 등)
                    WHERE("""
                        NOT EXISTS (
                            SELECT 1
                            FROM vendor_item vi
                            JOIN vendor v ON v.id = vi.vendor_id
                            WHERE vi.product_id = p.id
                              AND vi.status = 'ACTIVE'
                              AND v.status = 'ACTIVE'
                        )
                    """);
                }
            }

            ORDER_BY("p.created_at DESC");
        }}.toString();
    }
    
    public String findVendorById(@Param("id") Long id) {
        return new SQL(){{
            SELECT("id, type, vendor_name AS vendorName, telephone, email, boss_name AS bossName, address, memo, image_url AS imageUrl, created_at AS createdAt");
            FROM("vendor");
            WHERE("id = #{id}");
            WHERE("status = 'ACTIVE'");
        }}.toString();
    }

    // 거래처 품목 찾기
    public String findVendorItems(Map<String, Object> params) {
        return new SQL(){{
            SELECT("p.id AS productId, p.name AS productName, vi.purchase_price AS purchasePrice");
            FROM("vendor_item vi");
            INNER_JOIN("product p ON p.id = vi.product_id");
            WHERE("vi.vendor_id = #{vendorId}");
            WHERE("vi.status = 'ACTIVE'");
            ORDER_BY("p.name ASC");
        }}.toString();
    }

    public String updateVendor(Long id, VendorCreateRequest req) {

        return new SQL(){{
            UPDATE("vendor");
            SET("type = #{req.type}");
            SET("vendor_name = #{req.vendorName}");
            SET("telephone = #{req.telephone}");
            SET("email = #{req.email}");
            SET("boss_name = #{req.bossName}");
            SET("address = #{req.address}");
            SET("memo = #{req.memo}");
            WHERE("id = #{id}");
        }}.toString();
    }

    // 거래처 삭제
    public String deleteVendorById(Map<String, Object> params) {
        return new SQL(){{
            DELETE_FROM("vendor");
            WHERE("id = #{id}");
        }}.toString();
    }

    // 거래처 품목 삭제
    public String deleteVendorItemsByVendorId(Map<String, Object> params) {
        return new SQL(){{
            DELETE_FROM("vendor_item");
            WHERE("vendor_id = #{vendorId}");
        }}.toString();
    }



}
