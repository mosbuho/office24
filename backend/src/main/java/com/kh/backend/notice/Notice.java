package com.kh.backend.notice;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Notice {
    private int no;
    private String title;
    private String content;
    private Date reg_date;
}
