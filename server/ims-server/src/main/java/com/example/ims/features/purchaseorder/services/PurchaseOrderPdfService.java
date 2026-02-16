package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;
import com.example.ims.features.vendor.entities.VendorItem;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

@Service
public class PurchaseOrderPdfService {

    private final byte[] nanumRegular;
    private final byte[] nanumBold;

    public PurchaseOrderPdfService() throws Exception {
        this.nanumRegular = new ClassPathResource("fonts/NanumGothic-Regular.ttf").getContentAsByteArray();
        this.nanumBold = new ClassPathResource("fonts/NanumGothic-Bold.ttf").getContentAsByteArray();
    }

    public PurchaseOrderPdfContent buildDto(PurchaseOrderContext ctx) {
        List<PurchaseOrderPdfContent.Line> lines = ctx.orders().stream()
            .map(this::toLine)
            .toList();

        int total = lines.stream().mapToInt(PurchaseOrderPdfContent.Line::amount).sum();

        return new PurchaseOrderPdfContent(
            ctx.orderNumber(), ctx.vendor(), lines, total
        );
    }

    private PurchaseOrderPdfContent.Line toLine(Order o) {
        VendorItem vi = o.getVendorItem();
        if (vi == null) throw new IllegalStateException("VendorItem이 누락되었습니다.");

        Product p = vi.getProduct();
        if (p == null) throw new IllegalStateException("Product가 누락되었습니다.");

        int qty = Objects.requireNonNullElse(o.getCount(), 0);
        int unitPrice = Objects.requireNonNullElse(vi.getPurchasePrice(), 0);
        int amount = unitPrice * qty;

        return new PurchaseOrderPdfContent.Line(
            p.getId(), p.getName(), p.getType(), p.getBrand(), qty, unitPrice, amount
        );
    }

    public byte[] generate(PurchaseOrderPdfContent content) {
        String html = PurchaseOrderHtmlTemplate.render(content);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();

            builder.useFont(() -> new ByteArrayInputStream(nanumRegular), "NanumGothic");
            builder.useFont(() -> new ByteArrayInputStream(nanumBold),
                    "NanumGothic", 700, PdfRendererBuilder.FontStyle.NORMAL, true);

            builder.withHtmlContent(html.replace("\uFEFF","").trim(), "file:/");
            builder.toStream(os);
            builder.run();

            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("발주서 PDF 생성 실패", e);
        }
    }
}
