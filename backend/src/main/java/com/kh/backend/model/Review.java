package com.kh.backend.model;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Review {
    private int no;
    private int member_no;
    private int office_no;
    private int booking_no;
    private String content;
    private double rating;
    private Date reg_date;
}