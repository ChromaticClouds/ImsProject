package com.example.ims.features.outbound.dto;

import java.time.LocalDate;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OutboundSummaryRow {
	private String status;
    private String statusText;        // "출고 대기" or "미납"
    private String orderNumber;
    private Long sellerVendorId;
    private String sellerVendorName;
    private int itemCount;
    private long totalAmount;
    private Long userId;              // 출고담당자
    private String userName;        
    
    private LocalDate receiveDate;    // 납기희망일(recieve_date)
    private boolean hasShortage; // 재고 부족
    private LocalDate orderDate;
}
