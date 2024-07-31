package com.kh.backend.statistics;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StatisticsMapper {
    Map<String, Object> getAccumulate();

    List<Map<String, Object>> getAgeGroup();

    List<Map<String, Object>> getOfficeSidoGroup();
}