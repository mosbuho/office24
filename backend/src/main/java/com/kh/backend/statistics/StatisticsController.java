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

    @GetMapping("/admin/accumulate")
    public Map<String, Object> getAccumulate() {
        return statisticsService.getAccumulate();
    }

    @GetMapping("/admin/agegroup")
    public List<Map<String, Object>> getAgeGroup() {
        return statisticsService.getAgeGroup();
    }

    @GetMapping("/admin/sidogroup")
    public List<Map<String, Object>> getOfficeSidoGroup() {
        return statisticsService.getOfficeSidoGroup();
    }
}