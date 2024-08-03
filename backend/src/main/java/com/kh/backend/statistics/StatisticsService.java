package com.kh.backend.statistics;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsMapper statisticsMapper;

    public Map<String, Object> getAccumulate() {
        return statisticsMapper.getAccumulate();
    }

    public List<Map<String, Object>> getAgeGroup() {
        return statisticsMapper.getAgeGroup();
    }

    public List<Map<String, Object>> getSidoGroup() {
        return statisticsMapper.getSidoGroup();
    }

    public List<Map<String, Object>> getGroupData(String table) {
        return statisticsMapper.getGroupData(table.replace("group", ""));
    }
}