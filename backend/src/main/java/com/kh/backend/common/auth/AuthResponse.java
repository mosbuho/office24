package com.kh.backend.common.auth;

import lombok.Getter;

@Getter
public class AuthResponse {
    private final int no;
    private final String accessToken;
    private final String refreshToken;

    public AuthResponse(String accessToken, String refreshToken, int no) {
        this.no = no;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}