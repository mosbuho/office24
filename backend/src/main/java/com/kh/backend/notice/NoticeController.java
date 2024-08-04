package com.kh.backend.notice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    @GetMapping("/admin/notice")
    public List<Notice> getNotice(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        return noticeService.getNotice(page, size);
    }
}
