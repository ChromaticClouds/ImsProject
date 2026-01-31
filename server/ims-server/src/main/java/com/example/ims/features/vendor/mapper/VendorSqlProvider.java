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

            if (type != null) WHERE("type = #{type}");
            if (keyword != null) WHERE("vendor_name LIKE CONCAT('%', #{keyword}, '%')");
        }}.toString();
    }
}
