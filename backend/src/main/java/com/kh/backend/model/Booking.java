package com.kh.backend.model;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Booking {
    private int no;
    private int office_no;
    private int member_no;
    private String name;
    private String phone;
    private String payment;
    private int price;
    private Date start_date;
    private Date end_date;
    private Date reg_date;
}
