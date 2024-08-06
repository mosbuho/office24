package com.kh.backend.common.message;

import lombok.Data;

@Data
public class MessageRequest {
    private String to;
    private String text;
    private int count = 0;
    private long lastRequestTime = 0;
}
