package com.kh.backend.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewMapper {
    List<Review> getAllReviews(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalReviewCount(@Param("f") String f, @Param("q") String q);

    void deleteReview(@Param("no") int no);
}