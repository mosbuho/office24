package com.kh.backend.notice;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface NoticeMapper {
    List<Notice> getNotice(Map<String, Integer> params);

    List<Notice> getAllNotices(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalNoticeCount(@Param("f") String f, @Param("q") String q);

    void updateNotice(Notice notice);

    void deleteNotice(int no);

    void createNotice(Notice notice);
}
