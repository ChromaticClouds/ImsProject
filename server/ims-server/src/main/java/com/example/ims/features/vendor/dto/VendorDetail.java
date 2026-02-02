package com.example.ims.features.vendor.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorDetail {
	
	private Long id;

    private String type;
    private String vendorName;
    private String telephone;
    private String email;
    private String address;
    private String memo;
    private LocalDateTime createdAt;

}
