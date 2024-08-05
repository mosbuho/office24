package com.kh.backend.office;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface OfficeMapper {
        Integer getTotalRevenue(@Param("no") int no);

        Integer getTotalUsage(@Param("no") int no);

        Double getTotalRating(@Param("no") int no);

        Integer getActiveOfficeCount(@Param("no") int no);

        List<Map<String, Object>> getMonthlyRevenue(@Param("no") int no);

        List<Map<String, Object>> getTotalGenderRatio(@Param("no") int no);

        List<Office> getOfficeStatusPaged(@Param("no") int no, @Param("offset") int offset, @Param("limit") int limit);

        Integer getOfficeStatusCount(@Param("no") int no);

        List<Office> getOffices(@Param("no") int no, @Param("offset") int offset, @Param("limit") int limit,
                        @Param("availability") Integer availability, @Param("searchText") String searchText);

        Integer getOfficeCount(@Param("no") int no, @Param("availability") Integer availability,
                        @Param("searchText") String searchText);

        void deleteOffice(@Param("no") int no);

        void insertOffice(Office office);

        void insertOfficeImage(OfficeImage officeImage);

        Office getOfficeByNo(@Param("officeNo") int officeNo);

        void updateOffice(Office office);

        List<String> getOfficeImagesByOfficeNo(@Param("officeNo") int officeNo);

        void deleteOfficeImage(@Param("officeNo") int officeNo, @Param("imageName") String imageName);

        List<Office> getOfficeNotAvailability(Map<String, Integer> params);

        List<Office> adminGetAllOffices(@Param("start") int start,
                        @Param("end") int end,
                        @Param("f") String f,
                        @Param("q") String q,
                        @Param("availability") Integer availability);

        int adminGetTotalOfficeCount(@Param("f") String f,
                        @Param("q") String q,
                        @Param("availability") Integer availability);

        void adminDeleteOffice(int no);
}
