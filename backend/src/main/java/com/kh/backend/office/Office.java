package com.kh.backend.office;

import java.util.Date;

import lombok.Data;

@Data
public class Office {
    private int no;
    private int managerNo;
    private String title;
    private String address;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private String content;
    private Long price;
    private Long capacity;
    private String titleImg;
    private int availability;
    private Date regDate;
}
