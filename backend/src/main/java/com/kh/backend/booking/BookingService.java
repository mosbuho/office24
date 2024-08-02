package com.kh.backend.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    @Autowired
    private BookingMapper bookingMapper;

    public Map<String, Object> getBookingsByManager(Integer managerNo, int page, int size) {
        int offset = (page - 1) * size;
        List<Map<String, Object>> bookings = bookingMapper.selectBookingsByManager(managerNo, size, offset);
        int totalBookings = bookingMapper.countBookingsByManager(managerNo);
        int totalPages = (int) Math.ceil((double) totalBookings / size);

        Map<String, Object> result = new HashMap<>();
        result.put("bookings", bookings);
        result.put("totalPages", totalPages);
        result.put("currentPage", page);
        return result;
    }
}
