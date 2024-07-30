package com.kh.backend.office;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        stats.put("totalRevenue", officeService.getTotalRevenue(no));
        stats.put("totalUsage", officeService.getTotalUsage(no));
        stats.put("totalRating", officeService.getTotalRating(no));
        stats.put("totalActive", officeService.getActiveOfficeCount(no));

        List<Map<String, Object>> monthlyRevenue = officeService.getMonthlyRevenue(no);
        stats.put("monthlyRevenue", monthlyRevenue);
        List<Map<String, Object>> genderRatio = officeService.getTotalGenderRatio(no);
        stats.put("genderRatio", genderRatio);
        Map<String, Object> officeStatus = getOfficeStatusPaged(no, 1, 100);
        stats.put("offices", officeStatus.get("offices"));
        return ResponseEntity.ok(stats);
    }

    // 오피스 상태 목록 조회 (페이지네이션)
    @GetMapping("/manager/office/status/{no}")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        List<Office> offices = officeService.getOfficeStatusPaged(no, page, size);
        int total = officeService.getOfficeStatusCount(no);

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

        List<Office> offices = officeService.getOffices(no, page, size, availability, searchText);
        int total = officeService.getOfficeCount(no, availability, searchText);

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

    // 입력받은 office 객체에서 특정 필드만 포함하여 Map<String, Object>로 반환
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
