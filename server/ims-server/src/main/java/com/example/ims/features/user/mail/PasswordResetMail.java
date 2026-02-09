package com.example.ims.features.user.mail;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PasswordResetMail {

    private final String token;
    private final String clientBaseUrl;

    public String getMailContents() {
        String resetUrl = clientBaseUrl + "/password-reset?token=" + token;
        return String.format(TEMPLATE, resetUrl);
    }

    private static final String TEMPLATE = """
    <!doctype html>
    <html>
    <body style='margin: 0; padding: 0; background: #f5f5f5'>
        <table width='100%%' cellpadding='0' cellspacing='0'>
        <tr>
            <td align='center' style='padding: 40px 0'>
            <!-- container -->
            <table
                width='600'
                cellpadding='0'
                cellspacing='0'
                style='background: #ffffff; border-radius: 8px'
            >
                <tr>
                <td style='padding: 32px; font-family: Arial, sans-serif'>
                    <!-- logo -->
                    <h2 style='margin: 0 0 24px 0'>IMS PROJECT</h2>

                    <!-- message -->
                    <p style='font-size: 16px; line-height: 1.5'>
                    <strong>비밀번호 재설정 안내</strong>
                    </p>

                    <p style='font-size: 14px; color: #666'>
                    아래 버튼을 눌러 비밀번호 재설정을 진행하세요.
                    </p>

                    <!-- button -->
                    <table cellpadding='0' cellspacing='0' style='margin: 32px 0'>
                    <tr>
                        <td bgcolor='#2563eb' style='border-radius: 6px'>
                        <a
                            href='%s'
                            style='
                            display: inline-block;
                            padding: 14px 28px;
                            color: #ffffff;
                            text-decoration: none;
                            font-weight: bold;
                            font-size: 15px;
                            '
                        >
                            비밀번호 재설정
                        </a>
                        </td>
                    </tr>
                    </table>

                    <!-- note -->
                    <p style='font-size: 12px; color: #888'>
                    이 링크는 일정 시간 후 만료됩니다.<br />
                    본인이 요청하지 않았다면 이 메일을 무시하세요.
                    </p>
                </td>
                </tr>
            </table>

            <!-- footer -->
            <p style='font-size: 11px; color: #aaa; margin-top: 16px'>
                © 2026 IMS Corp. All rights reserved.
            </p>
            </td>
        </tr>
        </table>
    </body>
    </html>
    """;
}
