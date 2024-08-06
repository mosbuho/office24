package com.kh.backend.booking;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Map<String, Object> getDetailedBookingsByManager(Integer managerNo, int page, int size, String filter,
            String searchText, String sortOrder) {
        int offset = (page - 1) * size;
        List<Map<String, Object>> bookings = bookingMapper.selectDetailedBookingsByManager(managerNo, size, offset,
                filter, searchText, sortOrder);
        int totalBookings = bookingMapper.countBookingsByManagerWithFilter(managerNo, filter, searchText);
        int totalPages = (int) Math.ceil((double) totalBookings / size);

        Map<String, Object> result = new HashMap<>();
        result.put("bookings", bookings);
        result.put("totalPages", totalPages);
        result.put("currentPage", page);
        return result;
    }

    public void deleteBooking(int bookingNo) {
        bookingMapper.deleteBooking(bookingNo);
    }

    public Map<String, Object> getBookingsWithPagination(int page, int size, String f, String q) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Booking> bookings = bookingMapper.getAllBookings(start, end, f, q);
        int totalCount = bookingMapper.getTotalBookingCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("bookings", bookings);
        response.put("totalCount", totalCount);
        return response;
    }
}
