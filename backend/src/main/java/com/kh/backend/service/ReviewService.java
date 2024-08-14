package com.kh.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.backend.mapper.ReviewMapper;
import com.kh.backend.model.Review;

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

    public List<Map<String, Object>> getReviewsByMemberNo(int no, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return reviewMapper.getReviewsByMemberNoWithPagination(no, startRow, endRow);
    }

    public Map<String, Object> updateReview(int no, String content, double rating) {
        int affectedRows = reviewMapper.updateReview(no, content, rating);
        if (affectedRows == 0) {
            throw new NoSuchElementException("Review not found with id: " + no);
        }

        return Map.of(
                "no", no,
                "content", content,
                "rating", rating);
    }

    @Transactional
    public void insertReview(Review review) {
        reviewMapper.insertReview(review);
    }

    public List<Integer> getWrittenReviewNumbers(int no) {
        return reviewMapper.getWrittenReviewNumbers(no);
    }
}
