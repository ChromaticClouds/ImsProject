package com.example.ims.features.vendor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;

import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorResponse;

@Mapper
public interface VendorMapper {
    
    @SelectProvider(type = VendorSqlProvider.class, method = "findVendorList")
    List<VendorResponse> findVendorList(
		@Param("type") String type,
        @Param("keyword") String keyword,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
    
    @SelectProvider(type = VendorSqlProvider.class, method = "countVendorList")
    long countVendorList(
        @Param("type") String type,
        @Param("keyword") String keyword
    );
    
    @Insert("""
    INSERT INTO vendor (type, vendor_name, telephone, email, boss_name, address, memo, image_url, created_at) 
    VALUES (#{type}, #{vendorName}, #{telephone}, #{email}, #{bossName}, #{address}, #{memo}, #{imageUrl}, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertVendor(Vendor vendor);
}
