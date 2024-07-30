package com.kh.backend.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/manager/booking/{no}")
    public ResponseEntity<Map<String, Object>> getBookingsByManager(
            @PathVariable Integer no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        Map<String, Object> result = bookingService.getBookingsByManager(no, page, size);
        return ResponseEntity.ok(result);
    }
}
