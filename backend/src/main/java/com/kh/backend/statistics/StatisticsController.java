package com.kh.backend.statistics;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/admin/getStatistics")
    public Map<String, Object> getStatistics() {
        return statisticsService.getStatistics();
    }

    @GetMapping("/admin/getAgeGroupStatistics")
    public List<Map<String, Object>> getAgeGroupStatistics() {
        return statisticsService.getAgeGroupStatistics();
    }
}