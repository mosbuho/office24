package com.kh.backend.office;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface OfficeMapper {
    // 누적 수익
    int getTotalRevenue(@Param("no") int no);

    // 누적 이용자 수
    int getTotalUsage(@Param("no") int no);

    // 총 평점
    Double getTotalRating(@Param("no") int no);

    // 현재 이용 중인 오피스 개수
    Integer getActiveOfficeCount(@Param("no") int no);

    // 월별 수익 map으로 불러옴
    List<Map<String, Object>> getMonthlyRevenue(@Param("no") int no);

    // 성비
    List<Map<String, Object>> getTotalGenderRatio(@Param("no") int no);

    List<Office> getOfficeStatus(int no);
}
