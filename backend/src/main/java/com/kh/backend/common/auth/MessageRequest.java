package com.kh.backend.common.auth;

import lombok.Getter;

@Getter
class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }
}