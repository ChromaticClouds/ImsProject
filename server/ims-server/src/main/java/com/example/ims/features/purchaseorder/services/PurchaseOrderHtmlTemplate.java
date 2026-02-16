package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;

import java.text.NumberFormat;
import java.util.Locale;

public class PurchaseOrderHtmlTemplate {

    private static final NumberFormat KRW = NumberFormat.getNumberInstance(Locale.KOREA);

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    public static String render(PurchaseOrderPdfContent c) {
        String rows = c.lines().stream().map(line -> """
        <tr>
          <td class="c">%d</td>
          <td>%s</td>
          <td>%s</td>
          <td>%s</td>
          <td class="r">%s</td>
          <td class="r">%s</td>
          <td class="r">%s</td>
        </tr>
        """.formatted(
            line.productId(),
            esc(String.valueOf(line.productId())),
            esc(String.valueOf(line.productType())),
            esc(line.brand()),
            KRW.format(line.quantity()),
            KRW.format(line.unitPrice()),
            KRW.format(line.amount())
        )).reduce("", String::concat);

        String vendorName = esc(c.vendor().getVendorName());
        String vendorEmail = esc(c.vendor().getEmail());

        return """
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <style>
            @page { size: A4; margin: 18mm 14mm; }
            body { font-family: "Malgun Gothic", sans-serif; font-size: 12px; color: #111; }
            .row { display:flex; justify-content:space-between; gap: 12px; }
            .title { font-size: 20px; font-weight: 700; margin: 0 0 6px; }
            .muted { color:#666; }
            .box { border: 1px solid #ddd; padding: 10px; border-radius: 6px; }
            table { width:100%%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background:#f5f6f8; text-align:center; }
            td.c { text-align:center; }
            td.r { text-align:right; }
            .totals { margin-top: 10px; display:flex; justify-content:flex-end; }
            .totals table { width: 260px; }
            .totals td.k { background:#f5f6f8; width:110px; }
          </style>
        </head>
        <body>

          <div class="row" style="align-items:center;">
            <div>
              <div class="title">PURCHASE ORDER (발주서)</div>
              <div class="muted">발주번호: <b>%s</b></div>
            </div>
            <div style="text-align:right;">
              <div><b>IMS</b></div>
              <div class="muted">발주 담당: (담당자명)</div>
            </div>
          </div>

          <div class="row" style="margin-top: 12px;">
            <div class="box" style="flex:1;">
              <div style="font-weight:700; margin-bottom:6px;">To (공급처)</div>
              <div>%s</div>
              <div class="muted">%s</div>
            </div>
            <div class="box" style="flex:1;">
              <div style="font-weight:700; margin-bottom:6px;">요청</div>
              <div>확인 후 회신 부탁드립니다.</div>
              <div class="muted">납기 가능 여부 및 납기일을 알려주세요.</div>
            </div>
          </div>

          <table style="margin-top: 12px;">
            <thead>
              <tr>
                <th style="width:80px;">상품ID</th>
                <th>상품명</th>
                <th style="width:90px;">타입</th>
                <th style="width:110px;">브랜드</th>
                <th style="width:70px;">수량</th>
                <th style="width:90px;">단가</th>
                <th style="width:100px;">금액</th>
              </tr>
            </thead>
            <tbody>
              %s
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr><td class="k">Total</td><td class="r"><b>%s</b></td></tr>
            </table>
          </div>

          <div class="muted" style="margin-top: 14px; font-size: 11px;">
            ※ 본 발주서는 전자문서입니다.
          </div>

        </body>
        </html>
        """.formatted(
            esc(c.orderNumber()),
            vendorName,
            vendorEmail,
            rows,
            KRW.format(c.totalAmount())
        );
    }

    private static String format(int amount) {
        return NumberFormat
            .getNumberInstance(java.util.Locale.KOREA)
            .format(amount);
    }

    public static String render(PurchaseOrderContext ctx,
                                PurchaseOrderPdfContent content) {

        String orderNo = esc(ctx.orderNumber());
        String vendorName = esc(ctx.vendor().getVendorName());
        String bossName = esc(ctx.vendor().getBossName());
        String email = esc(ctx.vendor().getEmail());
        String tel = esc(ctx.vendor().getTelephone());

        int totalQty = content.lines().stream()
                .mapToInt(PurchaseOrderPdfContent.Line::quantity)
                .sum();

        String totalAmount = format(content.totalAmount());

        return """
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="
          margin:0;
          padding:0;
          background:#f5f6f8;
          font-family: Arial, 'Malgun Gothic', sans-serif;
        ">

        <div style="
          max-width:640px;
          margin:30px auto;
          background:#ffffff;
          border:1px solid #ddd;
          border-radius:6px;
          padding:24px;
        ">

          <!-- Header -->
          <h2 style="margin:0 0 12px;color:#222;">
            📄 발주서 전송 안내
          </h2>

          <p style="margin:0 0 16px;color:#555;font-size:14px;">
            안녕하세요. 아래와 같이 발주서를 전달드립니다.
          </p>

          <!-- Summary Box -->
          <div style="
            background:#f9fafb;
            border:1px solid #e3e5e8;
            padding:14px;
            border-radius:5px;
            font-size:14px;
            margin-bottom:18px;
          ">

            <table style="width:100%%;">
              <tr>
                <td style="width:120px;color:#666;">발주번호</td>
                <td><b>%s</b></td>
              </tr>
              <tr>
                <td style="color:#666;">공급처</td>
                <td>%s (대표: %s)</td>
              </tr>
              <tr>
                <td style="color:#666;">총 품목수</td>
                <td>%d 건</td>
              </tr>
              <tr>
                <td style="color:#666;">총 금액</td>
                <td><b>%s 원</b></td>
              </tr>
            </table>

          </div>

          <!-- Main Message -->
          <p style="font-size:14px;line-height:1.6;color:#333;">
            첨부된 PDF 파일에 발주 상세 내역이 포함되어 있습니다.<br>
            확인 후 납기 가능 여부 및 출고 예정일 회신 부탁드립니다.
          </p>

          <!-- Reply Guide -->
          <div style="
            background:#fff7e6;
            border:1px solid #ffd591;
            padding:12px;
            border-radius:5px;
            margin:16px 0;
            font-size:13px;
          ">
            <b>📌 회신 예시</b><br><br>
            발주번호: %s<br>
            확인여부: 가능 / 불가<br>
            출고예정일: YYYY-MM-DD<br>
            비고: (있을 경우 작성)
          </div>

          <!-- Contact -->
          <div style="
            margin-top:20px;
            padding-top:12px;
            border-top:1px solid #eee;
            font-size:13px;
            color:#666;
          ">
            <b>공급처 연락처</b><br>
            담당: %s<br>
            이메일: %s<br>
            전화: %s
          </div>

          <!-- Footer -->
          <div style="
            margin-top:24px;
            font-size:12px;
            color:#999;
            text-align:center;
          ">
            본 메일은 IMS 시스템에서 자동 발송되었습니다.<br>
            문의사항은 담당자에게 연락 바랍니다.
          </div>

        </div>

        </body>
        </html>
        """
        .formatted(
                orderNo,
                vendorName,
                bossName,
                totalQty,
                totalAmount,
                orderNo,
                bossName,
                email,
                tel
        );
    }
}
