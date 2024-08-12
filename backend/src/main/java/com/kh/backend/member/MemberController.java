package com.kh.backend.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.booking.BookingService;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final BookingService bookingService;

    public MemberController(MemberService memberService, BookingService bookingService) {
        this.memberService = memberService;
        this.bookingService = bookingService;
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
}