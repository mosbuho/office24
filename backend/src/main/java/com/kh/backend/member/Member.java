package com.kh.backend.member;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class Member {
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String email;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birth;
    private String gender;
}