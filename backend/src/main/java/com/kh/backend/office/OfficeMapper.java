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

    // 오피스 신청 상태
    //List<Office> getOfficeStatus(int no);
    List<Office> getOfficeStatusPaged(@Param("no") int no, @Param("offset") int offset, @Param("limit") int limit);
    int getOfficeStatusCount(@Param("no") int no);

    // 오피스 목록 조회 (상태, 검색 포함)
    List<Office> getOffices(@Param("no") int no, @Param("offset") int offset, @Param("limit") int limit,
        @Param("availability") Integer availability, @Param("searchText") String searchText);

    // 오피스 총 개수 조회 (페이징)
    int getOfficeCount(@Param("no") int no, @Param("availability") Integer availability, @Param("searchText") String searchText);

    // 오피스 no로 오피스 정보 삭제
    void deleteOffice(@Param("no") int no);

    // 오피스 등록
    void insertOffice(Office office);

    // 기타 이미지 등록
    void insertOfficeImage(OfficeImage officeImage);
}
