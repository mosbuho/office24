package com.kh.backend.booking;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BookingMapper {
    
    List<Map<String, Object>> selectBookingsByManager(@Param("no") Integer no, @Param("limit") int limit, @Param("offset") int offset);

    int countBookingsByManager(@Param("no") Integer no);
}
