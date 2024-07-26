package com.kh.backend.common.auth;

import lombok.Getter;

@Getter
class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }
}