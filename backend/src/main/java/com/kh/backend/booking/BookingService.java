package com.kh.backend.booking;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingMapper bookingMapper;

    public Map<String, Object> getBookingsByManager(int managerNo, int page, int size) {
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

    public Map<String, Object> getDetailedBookingsByManager(int managerNo, int page, int size, String filter,
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

    public List<Date> getUnavailableDates(int officeNo) {
        List<Booking> bookings = bookingMapper.getBookingsByOfficeNo(officeNo);
        List<Date> unavailableDates = new ArrayList<>();

        for (Booking booking : bookings) {
            Date start = booking.getStart_date();
            Date end = booking.getEnd_date();

            while (!start.after(end)) {
                unavailableDates.add(start);
                start = new Date(start.getTime() + (1000 * 60 * 60 * 24));
            }
        }
        return unavailableDates;
    }

    public void createBooking(Map<String, Object> bookingData) throws Exception {
        bookingMapper.insertBooking(bookingData);
    }

    public List<Map<String, Object>> getMemberReservations(int no) {
        return bookingMapper.getMemberReservations(no);
    }
    
    public boolean updateBooking(Map<String, Object> bookingData) {
        return bookingMapper.updateBooking(bookingData);
    }
}
