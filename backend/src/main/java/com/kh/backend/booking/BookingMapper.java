package com.kh.backend.booking;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BookingMapper {
    List<Map<String, Object>> selectBookingsByManager(@Param("no") Integer no, @Param("limit") int limit,
            @Param("offset") int offset);

    int countBookingsByManager(@Param("no") Integer no);

    List<Map<String, Object>> selectDetailedBookingsByManager(@Param("no") Integer no, @Param("limit") int limit,
            @Param("offset") int offset,
            @Param("filter") String filter, @Param("searchText") String searchText,
            @Param("sortOrder") String sortOrder);

    int countBookingsByManagerWithFilter(@Param("no") Integer no, @Param("filter") String filter,
            @Param("searchText") String searchText);

    void deleteBooking(@Param("bookingNo") int bookingNo);

    List<Booking> getAllBookings(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalBookingCount(@Param("f") String f, @Param("q") String q);

    List<Booking> getBookingsByOfficeNo(int officeNo);

    void insertBooking(Map<String, Object> bookingData) throws Exception;
     
    List<Map<String, Object>> getMemberReservations(int no);

    boolean updateBooking(Map<String, Object> params);
}
