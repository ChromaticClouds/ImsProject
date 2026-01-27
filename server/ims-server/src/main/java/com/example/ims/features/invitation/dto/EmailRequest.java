package com.example.ims.features.invitation.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class EmailRequest {

    @NotEmpty(message = "초대할 이메일을 하나 이상 입력해주세요.")
    private List<@Email(message = "이메일 형식이 올바르지 않습니다.") String> emails;
}
