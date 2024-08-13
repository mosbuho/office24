package com.kh.backend.refund;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RefundMapper {
    List<Refund> getAllRefunds(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalRefundCount(@Param("f") String f, @Param("q") String q);

    List<Map<String, Object>> getRefundsByManagerNo(@Param("no") int no, @Param("offset") int offset,
            @Param("size") int size);

    int getRefundsCountByManagerNo(@Param("no") int no);

}
