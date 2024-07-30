package com.kh.backend.office;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    @GetMapping("/manager/office/stats/{no}")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalRevenue", officeService.getTotalRevenue(no));
        stats.put("totalUsage", officeService.getTotalUsage(no));
        stats.put("totalRating", officeService.getTotalRating(no));
        stats.put("totalActive", officeService.getActiveOfficeCount(no));

        List<Map<String, Object>> monthlyRevenue = officeService.getMonthlyRevenue(no);
        stats.put("monthlyRevenue", monthlyRevenue);
        List<Map<String, Object>> genderRatio = officeService.getTotalGenderRatio(no);
        stats.put("genderRatio", genderRatio);
        List<Map<String, Object>> offices = convertOfficesToMap(officeService.getOfficeStatus(no));
        stats.put("offices", offices);
        System.out.println(stats);
        return ResponseEntity.ok(stats);
    }

    private List<Map<String, Object>> convertOfficesToMap(List<Office> offices) {
        return offices.stream()
            .map(office -> {
                Map<String, Object> officeMap = new HashMap<>();
                officeMap.put("no", office.getNo());
                officeMap.put("title", office.getTitle());
                officeMap.put("availability", office.getAvailability());
                return officeMap;
            })
            .collect(Collectors.toList());
    }
}
