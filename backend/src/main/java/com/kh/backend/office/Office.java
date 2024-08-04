package com.kh.backend.office;

import java.util.Date;

import lombok.Data;

@Data
public class Office {
    private int no;
    private int manager_no;
    private String managerName;
    private String title;
    private String address;
    private String zipCode;
    private String sido;
    private Double latitude;
    private Double longitude;
    private String content;
    private int price;
    private int capacity;
    private String titleImg;
    private int availability;
    private Date reg_date;
}