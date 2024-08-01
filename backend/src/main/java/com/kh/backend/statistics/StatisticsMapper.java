package com.kh.backend.statistics;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StatisticsMapper {
    Map<String, Object> getAccumulate();

    List<Map<String, Object>> getAgeGroup();

    List<Map<String, Object>> getSidoGroup();

    List<Map<String, Object>> getGroupData(@Param("table") String table);

}