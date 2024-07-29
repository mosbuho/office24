package com.kh.backend.office;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Office {
    private Long no;
    private Long managerNo;
    private String title;
    private String address;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private String content;
    private Long price;
    private Long capacity;
    private String titleImg;
    private Boolean availability;
    private Date regDate;
}
