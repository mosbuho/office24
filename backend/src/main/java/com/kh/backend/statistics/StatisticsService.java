package com.kh.backend.statistics;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsMapper statisticsMapper;

    public Map<String, Object> getStatistics() {
        return statisticsMapper.getStatistics();
    }

    public List<Map<String, Object>> getAgeGroupStatistics() {
        return statisticsMapper.getAgeGroupStatistics();
    }
}