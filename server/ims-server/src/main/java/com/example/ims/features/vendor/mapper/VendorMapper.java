package com.example.ims.features.vendor.mapper;

import java.util.List;

import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.scripting.xmltags.XMLLanguageDriver;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Lang;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;

import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorCreateRequest;
import com.example.ims.features.vendor.dto.VendorResponse;

import com.example.ims.features.vendor.dto.VendorItemResponse;
import com.example.ims.features.vendor.dto.VendorDetailResponse;
import com.example.ims.features.vendor.dto.VendorDetailVendor;

@Mapper
public interface VendorMapper {
    
	// 거래처 리스트
    @SelectProvider(type = VendorSqlProvider.class, method = "findVendorList")
    List<VendorResponse> findVendorList(
		@Param("type") String type,
        @Param("keyword") String keyword,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
    
    // 거래처 리스트 수량
    @SelectProvider(type = VendorSqlProvider.class, method = "countVendorList")
    long countVendorList(
        @Param("type") String type,
        @Param("keyword") String keyword
    );
    
    @Insert("""
    INSERT INTO vendor (type, vendor_name, telephone, email, boss_name, address, memo, image_url, status, created_at) 
    VALUES (#{type}, #{vendorName}, #{telephone}, #{email}, #{bossName}, #{address}, #{memo}, #{imageUrl}, 'ACTIVE', NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertVendor(Vendor vendor);
    
    
    @Lang(XMLLanguageDriver.class)
    @Insert("""
    		<script>
    		  INSERT INTO vendor_item (product_id, vendor_id, purchase_price, status)
    		  VALUES
    		  <foreach collection="items" item="it" separator=",">
    		    (#{it.productId}, #{vendorId}, #{it.purchasePrice}, 'ACTIVE')
    		  </foreach>
    		</script>
    		""")
    		int insertVendorItems(
    		    @Param("vendorId") Long vendorId,
    		    @Param("items") List<VendorCreateRequest.VendorItemCreate> items
    		);
    
    // 품목 검색
    @SelectProvider(type = VendorSqlProvider.class, method = "searchProducts")
    List<Map<String, Object>> searchProducts(
        @Param("keyword") String keyword,
        @Param("excludeAssigned") boolean excludeAssigned,
        @Param("currentVendorId") Long currentVendorId
    );
    
    // 거래처 찾기
    @SelectProvider(type = VendorSqlProvider.class, method = "findVendorById")
    VendorDetailVendor findVendorById(@Param("id") Long id);

    // 거래처 품목 찾기
    @SelectProvider(type = VendorSqlProvider.class, method = "findVendorItems")
    List<VendorItemResponse> findVendorItems(@Param("vendorId") Long vendorId);

    // 거래처 수정
    @UpdateProvider(type = VendorSqlProvider.class, method = "updateVendor")
    int updateVendor(@Param("id") Long id, @Param("req") VendorCreateRequest req);

    // 거래처 삭제
    @DeleteProvider(type = VendorSqlProvider.class, method = "deleteVendorById")
    int deleteVendorById(@Param("id") Long id);

    // 거래처 품목 삭제 -- 재검색을 위해 필요
    @DeleteProvider(type = VendorSqlProvider.class, method = "deleteVendorItemsByVendorId")
    int deleteVendorItemsByVendorId(@Param("vendorId") Long vendorId);
    
    @Update("""
            UPDATE vendor
            SET status = 'DELETED'
            WHERE id = #{id}
              AND status = 'ACTIVE'
        """)
        int softDeleteVendor(@Param("id") Long id);
    
    @Update("""
    		UPDATE vendor_item
    		SET status = 'DELETED'
    		WHERE vendor_id = #{vendorId}
    		  AND status = 'ACTIVE'
    		""")
    		int softDeleteVendorItemsByVendorId(@Param("vendorId") Long vendorId);

    // 특정 vendor_id + product_id 의 vendor_item 존재 여부
    
    @Select("""
    		SELECT id
    		FROM vendor_item
    		WHERE vendor_id = #{vendorId}
    		  AND product_id = #{productId}
    		LIMIT 1
    		""")
    		Long findVendorItemId(@Param("vendorId") Long vendorId, @Param("productId") Long productId);

    // vendor_item 구매 단가 업데이트 및 다시 ACTIVE
    		@Update("""
    		UPDATE vendor_item
    		SET purchase_price = #{purchasePrice},
    		    status = 'ACTIVE'
    		WHERE id = #{id}
    		""")
    		int updateVendorItemPrice(@Param("id") Long id, @Param("purchasePrice") Integer purchasePrice);

    		@Update("""
    				  UPDATE vendor_item
    				  SET status = 'DELETED'
    				  WHERE vendor_id = #{vendorId}
    				    AND product_id = #{productId}
    				    AND status = 'ACTIVE'
    				""")
    				int softDeleteVendorItem(@Param("vendorId") Long vendorId, @Param("productId") Long productId);

    
    
}
