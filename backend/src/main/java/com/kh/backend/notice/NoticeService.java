package com.kh.backend.notice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoticeService {
    @Autowired
    private NoticeMapper noticeMapper;

    public List<Notice> getNotice(int page, int size) {
        Map<String, Integer> params = new HashMap<>();
        params.put("start", (page - 1) * size + 1);
        params.put("end", page * size);
        return noticeMapper.getNotice(params);
    }

    public Map<String, Object> getNoticesWithPagination(int page, int size, String f, String q) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Notice> notices = noticeMapper.getAllNotices(start, end, f, q);
        int totalCount = noticeMapper.getTotalNoticeCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("notices", notices);
        response.put("totalCount", totalCount);
        return response;
    }

    public void updateNotice(Notice notice) {
        noticeMapper.updateNotice(notice);
    }

    public void deleteNotice(int no) {
        noticeMapper.deleteNotice(no);
    }

    public void createNotice(Notice notice) {
        noticeMapper.createNotice(notice);
    }
}
