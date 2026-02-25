package com.example.ims.features.auth.enums;

import lombok.Getter;

@Getter
public enum UserRank {
    FIRST_ADMIN("총괄책임자"),
    SECOND_ADMIN("창고관리자"),
    EMPLOYEE("사원");

    private final String label;

    private UserRank(String label) {
        this.label = label;
    }
}
