package com.kh.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.service.StatisticsService;

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
    public List<Map<String, Object>> getSidoGroup() {
        return statisticsService.getSidoGroup();
    }

    @GetMapping("admin/{group}")
    public List<Map<String, Object>> getGroupData(@PathVariable String group) {
        return statisticsService.getGroupData(group);
    }

}