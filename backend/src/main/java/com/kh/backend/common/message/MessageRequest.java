package com.kh.backend.common.message;

import lombok.Data;

@Data
public class MessageRequest {
    private String to;
    private String text;
}
