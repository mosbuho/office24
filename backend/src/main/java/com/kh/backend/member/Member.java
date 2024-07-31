package com.kh.backend.member;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Member {
    private int no;
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private Date birth;
    private String gender;
}