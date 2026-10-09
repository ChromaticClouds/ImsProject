package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;
import com.example.ims.features.vendor.entities.VendorItem;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.apache.pdfbox.cos.COSArray;
import org.apache.pdfbox.cos.COSString;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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
            ctx.user().getName(),
            ctx.user().getEmail(),
            ctx.user().getUserRank().getLabel(),
            ctx.receiveDate(),
            ctx.orderNumber(),
            ctx.vendor(),
            lines,
            total
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
            p.getId(), p.getName(), p.getType().format(), p.getBrand(), qty, unitPrice, amount
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

            return stabilize(os.toByteArray(), content.orderNumber());
        } catch (Exception e) {
            throw new RuntimeException("발주서 PDF 생성 실패", e);
        }
    }

    /**
     * 같은 내용이면 같은 바이트가 나오게 한다.
     * 렌더러가 PDF에 생성 시각과 문서 ID(시간 기반)를 매번 새로 넣는데, 메일을 다시 보낼 때
     * 같은 멱등 키로 첨부가 달라지면 메일 제공자가 요청을 거부하기 때문이다.
     */
    private static byte[] stabilize(byte[] pdf, String orderNumber) throws Exception {
        try (PDDocument document = PDDocument.load(pdf);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDDocumentInformation info = document.getDocumentInformation();
            info.setCreationDate(null);
            info.setModificationDate(null);

            byte[] digest = MessageDigest.getInstance("MD5")
                .digest(orderNumber.getBytes(StandardCharsets.UTF_8));
            COSArray id = new COSArray();
            id.add(new COSString(digest));
            id.add(new COSString(digest));
            document.getDocument().setDocumentID(id);

            document.save(out);
            return out.toByteArray();
        }
    }
}
