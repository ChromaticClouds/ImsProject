package com.example.ims.features.vendor.mapper;

import java.util.Map;

import org.apache.ibatis.jdbc.SQL;

public class VendorSqlProvider {
    

    public String findVendorList(Map<String, Object> params) {

        String type = (String) params.get("type");
        String keyword = (String) params.get("keyword");

        return new SQL() {{
            SELECT("id, type, vendor_name AS vendorName, telephone, email, address");
            FROM("vendor");
            WHERE("status = 'ACTIVE'");
            
            if (type != null) WHERE("type = #{type}");
            if (keyword != null) WHERE("vendor_name LIKE CONCAT('%', #{keyword}, '%')");
        
            ORDER_BY("created_at DESC");
        }}.toString()
        
        + " LIMIT ${limit} OFFSET ${offset}";
    }
    
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
    
    public String searchProducts(Map<String, Object> params) {
        String keyword = (String) params.get("keyword");
        Boolean excludeAssigned = (Boolean) params.get("excludeAssigned");

        return new SQL() {{
            SELECT("p.id, p.name");
            FROM("product p");

            if (keyword != null && !keyword.isEmpty()) {
                WHERE("p.name LIKE CONCAT('%', #{keyword}, '%')");
            }

            if (excludeAssigned != null && excludeAssigned) {
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

            ORDER_BY("p.created_at DESC");
        }}.toString();
    }
    
    public String findVendorById(Map<String, Object> params) {
        return new SQL(){{
            SELECT("id, type, vendor_name AS vendorName, telephone, email, boss_name AS bossName, address, memo, image_url AS imageUrl, created_at AS createdAt");
            FROM("vendor");
            WHERE("id = #{id}");
            WHERE("status = 'ACTIVE'");
        }}.toString();
    }

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

    public String updateVendor(Map<String, Object> params) {
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

    public String deleteVendorById(Map<String, Object> params) {
        return new SQL(){{
            DELETE_FROM("vendor");
            WHERE("id = #{id}");
        }}.toString();
    }

    public String deleteVendorItemsByVendorId(Map<String, Object> params) {
        return new SQL(){{
            DELETE_FROM("vendor_item");
            WHERE("vendor_id = #{vendorId}");
        }}.toString();
    }



}
