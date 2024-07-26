package com.kh.backend.common.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class LoginRequest {
    private String id;
    private String pw;
}
