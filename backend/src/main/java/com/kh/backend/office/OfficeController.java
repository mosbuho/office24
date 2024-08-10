package com.kh.backend.office;

import java.util.List;
import java.util.Map;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.booking.BookingService;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/img/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        return officeService.serveImage(filename);
    }

    @GetMapping("/office")
    public List<Map<String, Object>> getOfficeList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int attendance) {
        return officeService.getOfficeList(page, size, location, startDate, endDate, attendance);
    }

    // 오피스 상세 페이지
    @GetMapping("/office/{officeNo}")
    public ResponseEntity<Map<String, Object>> getOfficeDetails(@PathVariable int officeNo) {
        System.out.println(officeNo);
        Map<String, Object> officeDetails = officeService.getOfficeDetails(officeNo);
        return officeDetails != null ? ResponseEntity.ok(officeDetails) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping("/office/{officeNo}/notallowed-dates")
    public List<Date> getNotAllowedDates(@PathVariable int officeNo) {
        return bookingService.getUnavailableDates(officeNo);
    }
}
