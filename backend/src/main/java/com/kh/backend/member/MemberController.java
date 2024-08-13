package com.kh.backend.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.booking.BookingService;
import com.kh.backend.review.ReviewService;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final BookingService bookingService;
    private final ReviewService reviewService;

    public MemberController(MemberService memberService, BookingService bookingService, ReviewService reviewService) {
        this.memberService = memberService;
        this.bookingService = bookingService;
        this.reviewService = reviewService;
    }

    @GetMapping("/check-id")
    public ResponseEntity<String> idCheck(@RequestParam String id,
            @RequestParam(required = false, defaultValue = "true") boolean checkDuplicate) {
        boolean exists = memberService.idCheck(id);
        if (checkDuplicate && exists) {
            return ResponseEntity.ok(null);
        } else if (!checkDuplicate && !exists) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/exist-id")
    public ResponseEntity<?> idExist(@RequestParam String phone) {
        List<String> ids = memberService.idExist(phone);
        if (ids != null && !ids.isEmpty()) {
            return new ResponseEntity<>(ids, HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body("아이디가 존재하지 않습니다.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member.getId(), member.getPw(),
                    member.getName(), member.getPhone(), member.getEmail(),
                    member.getBirth(), member.getGender());
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-pw")
    public ResponseEntity<?> resetPw(@RequestBody Map<String, String> map) {
        String pw = map.get("pw");
        String id = map.get("id");

        boolean result = memberService.resetPw(pw, id);
        if (result) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/booking")
    public ResponseEntity<String> createBooking(@RequestBody Map<String, Object> bookingData) {
        try {
            bookingService.createBooking(bookingData);
            return ResponseEntity.ok("예약이 성공적으로 완료되었습니다!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약에 실패했습니다. 다시 시도해주세요.");
        }
    }

    @GetMapping("/{no}")
    @PreAuthorize("#no == authentication.details")
    public Member getMember(@PathVariable int no) {
        return memberService.getMemberById(no);
    }

    @PutMapping("/{no}")
    @PreAuthorize("#no == authentication.details")
    public ResponseEntity<String> updateMember(@PathVariable("no") int no, @RequestBody Member member) {
        try {
            member.setNo(no);
            memberService.updateMember(member);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{no}/change-pw")
    @PreAuthorize("#no == authentication.details")
    public ResponseEntity<?> updatePassword(@PathVariable int no, @RequestBody Map<String, String> passwordData) {
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        boolean updated = memberService.updateMemberPassword(no, currentPassword, newPassword);
        if (updated) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("{no}/delete")
    @PreAuthorize("#no == authentication.details")
    public ResponseEntity<?> deleteSelfAccount(@PathVariable int no, @RequestBody Map<String, Object> request) {
        Map<String, String> data = (Map<String, String>) request.get("data");
        String password = data.get("password");
        boolean deleted = memberService.deleteSelfAccount(no, password);
        if (deleted) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{officeNo}/like")
    public ResponseEntity<?> toggleLike(@PathVariable int officeNo, @RequestBody Map<String, Integer> request) {
        int userNo = request.get("userNo");
        boolean isLiked = memberService.toggleLike(userNo, officeNo);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("isLiked", isLiked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userNo}/favorites")
    public ResponseEntity<List<Map<String, Object>>> getFavorites(@PathVariable int userNo) {
        try {
            List<Map<String, Object>> favorites = memberService.getFavoriteOffices(userNo);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{userNo}/liked-offices")
    public ResponseEntity<?> getLikedOffices(@PathVariable int userNo) {
        try {
            List<Integer> likedOffices = memberService.getLikedOfficeNumbers(userNo);
            return ResponseEntity.ok(likedOffices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{no}/review")
    public List<Map<String, Object>> getReviewsByMemberNo(
            @PathVariable("no") int no,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "6") int size) {

        return reviewService.getReviewsByMemberNo(no, page, size);
    }

    @PutMapping("/review/{no}")
    public ResponseEntity<Map<String, Object>> updateReview(
            @PathVariable int no,
            @RequestBody Map<String, Object> reviewData) {
        String content = (String) reviewData.get("content");
        double rating = ((Number) reviewData.get("rating")).doubleValue();

        try {
            Map<String, Object> updatedReview = reviewService.updateReview(no, content, rating);
            return ResponseEntity.ok(updatedReview);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/review")
    public ResponseEntity<Void> deleteReviews(@RequestBody Map<String, List<Integer>> request) {
        boolean isDeleted = reviewService.deleteReviewsByIds(request.get("ids"));
        if (isDeleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/review")
    public ResponseEntity<?> createReview(@RequestBody Map<String, Object> reviewData) {
    try {
        int memberNo;
        try {
            memberNo = Integer.parseInt(reviewData.get("memberNo").toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid memberNo format");
        }
        if (!(reviewData.get("officeNo") instanceof Integer)) {
            return ResponseEntity.badRequest().body("Invalid officeNo format");
        }
        int officeNo = (int) reviewData.get("officeNo");

        String content = (String) reviewData.get("content");
        
        if (!(reviewData.get("rating") instanceof Number)) {
            return ResponseEntity.badRequest().body("Invalid rating format");
        }
        double rating = ((Number) reviewData.get("rating")).doubleValue();

        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }
        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }
        Map<String, Object> createdReview = reviewService.createReview(memberNo, officeNo, content, rating);
    
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("리뷰 작성 중 오류가 발생했습니다: " + e.getMessage());
    }
}


    @GetMapping("/{no}/reservations")
    public ResponseEntity<List<Map<String, Object>>> getMemberReservations(@PathVariable int no) {
        List<Map<String, Object>> reservations = bookingService.getMemberReservations(no);
        if (reservations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{no}/reservations")
    public ResponseEntity<?> updateReservation(@PathVariable("no") int no,
            @RequestBody Map<String, Object> updateData) {
        System.out.println("Received update request for office ID: " + no);
        System.out.println("Received data: " + updateData);

        try {
            boolean updated = bookingService.updateBooking(updateData);

            if (updated) {
                System.out.println("Reservation updated successfully");
                return ResponseEntity.ok().body("예약이 성공적으로 수정되었습니다.");
            } else {
                System.out.println("Failed to update reservation");
                return ResponseEntity.badRequest().body("예약 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("Error updating reservation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("예약 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{no}/booking")
    public ResponseEntity<Void> deleteBooking(@PathVariable int no, @RequestParam int bookingNo) {
        bookingService.deleteBooking(bookingNo);
        return ResponseEntity.ok().build();
    }
}
