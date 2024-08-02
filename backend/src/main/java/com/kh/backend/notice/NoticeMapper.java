package com.kh.backend.notice;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeMapper {
    List<Notice> getNotice(Map<String, Integer> params);
}
