package com.kh.backend.refund;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RefundMapper {
    List<Refund> getAllRefunds(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalRefundCount(@Param("f") String f, @Param("q") String q);
}
