package com.example.ims.features.history.dto;

import java.util.List;

import lombok.Data;

@Data
public class HistoryLotSummaryRow {
  private Long lotId;
  private String status;         
  private String statusText;      
  private String createdAt;      
  private Long userId;
  private String userName;
  private String memo;

  private Integer itemCount;     
  private Integer totalDelta;   

  private Long vendorId;        
  private String vendorName;

  private Long sellerVendorId;    
  private String sellerVendorName;
  
  private Long historyId;
  private Long productId;
  private String productCode;
  private String productName;
  private String type;     
  private String brand;
  private String volume;

  private Long vendorItemId;
  private Integer purchasePrice; 
  private Integer salePrice;    

  private Integer beforeCount;
  private Integer afterCount;
  private Integer delta;  
  
  private List<HistoryLotSummaryRow> items;
}

      

           