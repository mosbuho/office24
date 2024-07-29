package com.kh.backend.office;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface OfficeMapper {
    // 누적 수익
    Long getTotalRevenue(@Param("no") Long no);

    // 누적 이용자 수
    Long getTotalUsage(@Param("no") Long no);

    // 총 평점
    Double getTotalRating(@Param("no") Long no);

    // 현재 이용 중인 오피스 개수
    Integer getActiveOfficeCount(@Param("no") Long no);

    // 월별 수익 map으로 불러옴
    List<Map<String, Object>> getMonthlyRevenue(@Param("no") Long no);

    // 성비
    List<Map<String, Object>> getTotalGenderRatio(@Param("no") Long no);
}
