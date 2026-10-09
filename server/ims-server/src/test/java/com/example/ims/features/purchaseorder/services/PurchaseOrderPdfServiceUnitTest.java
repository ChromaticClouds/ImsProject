package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;
import com.example.ims.features.vendor.dto.Vendor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PurchaseOrderPdfServiceUnitTest {

    @Test
    void sameContentGivesTheSameBytesEvenWhenTimePasses() throws Exception {
        PurchaseOrderPdfService service = new PurchaseOrderPdfService();
        PurchaseOrderPdfContent content = content("PLA-1", 5);

        byte[] first = service.generate(content);
        // 렌더러가 넣는 생성 시각은 초 단위라, 1초 이상 지난 뒤에 다시 만들어도 같아야 한다.
        Thread.sleep(1100);
        byte[] second = new PurchaseOrderPdfService().generate(content);

        assertArrayEquals(first, second);
    }

    @Test
    void differentContentGivesDifferentBytes() throws Exception {
        PurchaseOrderPdfService service = new PurchaseOrderPdfService();

        byte[] five = service.generate(content("PLA-1", 5));
        byte[] six = service.generate(content("PLA-1", 6));

        assertFalse(java.util.Arrays.equals(five, six));
    }

    @Test
    void stabilizedPdfIsStillAReadablePdfWithTheOrderContent() throws Exception {
        byte[] pdf = new PurchaseOrderPdfService().generate(content("PLA-1", 5));

        try (PDDocument document = PDDocument.load(pdf)) {
            assertTrue(document.getNumberOfPages() >= 1);
            assertTrue(new PDFTextStripper().getText(document).contains("PLA-1"));
        }
    }

    private PurchaseOrderPdfContent content(String orderNumber, int quantity) {
        Vendor vendor = Vendor.builder()
            .id(1L).vendorName("공급처").bossName("대표").telephone("010-0000-0000").email("vendor@example.com")
            .build();

        return new PurchaseOrderPdfContent(
            "담당자", "buyer@example.com", "사원", "2099.01.01", orderNumber, vendor,
            List.of(new PurchaseOrderPdfContent.Line(1L, "소주", "소주", "브랜드", quantity, 1000, quantity * 1000)),
            quantity * 1000
        );
    }
}
