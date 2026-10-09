package com.example.ims.features.purchaseorder.enums;

/** 발주서 발송 이력의 상태. */
public enum PurchaseOrderDispatchStatus {
    /** 한 요청이 발송을 선점해 진행 중이다. */
    SENDING,
    /** 메일이 나갔다. 주문 상태 변경이 아직 안 됐을 수 있다. */
    SENT,
    /** PDF 생성이나 메일 전송이 실패했다. 다시 시도할 수 있다. */
    FAILED
}
