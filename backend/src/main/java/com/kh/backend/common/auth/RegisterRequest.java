package com.kh.backend.common.auth;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class RegisterRequest {
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private Date birth;
    private String gender;
}