package com.kh.backend.review;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewMapper {
    List<Review> getAllReviews(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalReviewCount(@Param("f") String f, @Param("q") String q);

    void deleteReview(@Param("no") int no);

    List<Map<String, Object>> getReviewsByOfficeNo(@Param("officeNo") int officeNo);

    int getReviewCountByOfficeNo(int officeNo);

    List<Map<String, Object>> getReviewsByMemberNoWithPagination(
        @Param("no") int no, 
        @Param("startRow") int startRow, 
        @Param("endRow") int endRow
    );

    int updateReview(@Param("no") int no, @Param("content") String content, @Param("rating") double rating);

    void insertReview(Map<String, Object> review);

}
