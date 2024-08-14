package com.kh.backend.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kh.backend.model.Refund;

@Mapper
public interface RefundMapper {
        List<Refund> getAllRefunds(@Param("start") int start, @Param("end") int end,
                        @Param("f") String f, @Param("q") String q);

        int getTotalRefundCount(@Param("f") String f, @Param("q") String q);

        List<Map<String, Object>> getRefundsByManagerNo(@Param("no") int no, @Param("offset") int offset,
                        @Param("size") int size);

        int getRefundsCountByManagerNo(@Param("no") int no);

        List<Map<String, Object>> getMemberRefunds(@Param("no") int no,
                        @Param("page") int page, @Param("limit") int limit);

        int countMemberRefunds(@Param("no") int no);

}
