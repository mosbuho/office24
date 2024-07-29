package com.kh.backend.member;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

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