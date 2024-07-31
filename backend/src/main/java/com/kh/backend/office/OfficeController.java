package com.kh.backend.office;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    // 통계 메소드
    @GetMapping("/manager/office/stats/{no}")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", officeService.getTotalRevenue(no));       // 누적 수익
        stats.put("totalUsage", officeService.getTotalUsage(no));           // 누적 이용자
        stats.put("totalRating", officeService.getTotalRating(no));         // 총 평점 (보유한 전체 오피스)
        stats.put("totalActive", officeService.getActiveOfficeCount(no));   // 현재 이용 중인 숫자

        List<Map<String, Object>> monthlyRevenue = officeService.getMonthlyRevenue(no); 
        stats.put("monthlyRevenue", monthlyRevenue); // 월 매출
        List<Map<String, Object>> genderRatio = officeService.getTotalGenderRatio(no);
        stats.put("genderRatio", genderRatio); // 이용자 성비
        Map<String, Object> officeStatus = getOfficeStatusPaged(no, 1, 100);
        stats.put("offices", officeStatus.get("offices")); // 오피스 등록 상태 (승인, 대기)
        return ResponseEntity.ok(stats);
    }

    // 오피스 상태 목록 조회 (페이지네이션)
    @GetMapping("/manager/office/status/{no}")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        List<Office> offices = officeService.getOfficeStatusPaged(no, page, size); // 오피스 목록
        int total = officeService.getOfficeStatusCount(no); // 오피스 수

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);
        
        return response;
    }

    // availability, searchText에 따라 오피스 목록 조회
    @GetMapping("/manager/office/{no}")
    public Map<String, Object> getAllOffices(@PathVariable int no, @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) Integer availability,
            @RequestParam(required = false) String searchText) {

        List<Office> offices = officeService.getOffices(no, page, size, availability, searchText); // 조건에 맞는 오피스 목록
        int total = officeService.getOfficeCount(no, availability, searchText); // 조건에 맞는 오피스 수

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);
        
        return response;
    }

    // 오피스 no로 오피스 정보 삭제
    @DeleteMapping("/manager/office/delete/{no}")
    public ResponseEntity<Void> deleteOffice(@PathVariable int no) {
        officeService.deleteOffice(no);
        return ResponseEntity.ok().build();
    }

}
