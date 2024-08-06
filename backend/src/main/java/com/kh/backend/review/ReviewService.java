package com.kh.backend.review;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    public Map<String, Object> getReviewsWithPagination(int page, int size, String f, String q) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Review> reviews = reviewMapper.getAllReviews(start, end, f, q);
        int totalCount = reviewMapper.getTotalReviewCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviews);
        response.put("totalCount", totalCount);
        return response;
    }

    public void deleteReview(int no) {
        reviewMapper.deleteReview(no);
    }

}
