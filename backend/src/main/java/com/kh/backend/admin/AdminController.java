package com.kh.backend.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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
import com.kh.backend.manager.Manager;
import com.kh.backend.manager.ManagerService;
import com.kh.backend.member.Member;
import com.kh.backend.member.MemberService;
import com.kh.backend.notice.Notice;
import com.kh.backend.notice.NoticeService;
import com.kh.backend.office.Office;
import com.kh.backend.office.OfficeService;
import com.kh.backend.review.ReviewService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final MemberService memberService;
    private final ManagerService managerService;
    private final OfficeService officeService;
    private final ReviewService reviewService;
    private final BookingService bookingService;
    private final NoticeService noticeService;

    public AdminController(MemberService memberService,
            ManagerService managerService,
            OfficeService officeService,
            ReviewService reviewService,
            BookingService bookingService,
            NoticeService noticeService) {
        this.memberService = memberService;
        this.managerService = managerService;
        this.officeService = officeService;
        this.reviewService = reviewService;
        this.bookingService = bookingService;
        this.noticeService = noticeService;
    }

    @GetMapping("/member")
    public Map<String, Object> getAllMembers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return memberService.getMembersWithPagination(page, size, f, q);
    }

    @PostMapping("/member/{no}/reset-pw")
    public ResponseEntity<String> resetMemberPw(@PathVariable("no") int no) {
        try {
            memberService.resetMemberPw(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/member/{no}")
    public ResponseEntity<String> updateMember(@PathVariable("no") int no, @RequestBody Member member) {
        try {
            member.setNo(no);
            memberService.updateMember(member);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/member/{no}")
    public ResponseEntity<String> deleteMember(@PathVariable("no") int no) {
        try {
            memberService.deleteMember(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/manager")
    public Map<String, Object> getAllManagers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return managerService.getManagersWithPagination(page, size, f, q);
    }

    @PostMapping("/manager/{no}/reset-pw")
    public ResponseEntity<String> resetManagerPw(@PathVariable("no") int no) {
        try {
            managerService.resetManagerPw(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/manager/{no}")
    public ResponseEntity<String> updateManager(@PathVariable("no") int no, @RequestBody Manager manager) {
        try {
            manager.setNo(no);
            managerService.updateManager(manager);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/manager/{no}")
    public ResponseEntity<String> deleteManager(@PathVariable("no") int no) {
        try {
            managerService.deleteManager(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/office")
    public Map<String, Object> getAllOffices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer availability) {
        return officeService.adminGetOfficesWithPagination(page, size, f, q, availability);
    }

    @GetMapping("/notavailability")
    public List<Office> getOfficeNotAvailability(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return officeService.getOfficeNotAvailability(page, size);
    }

    @GetMapping("/office/{no}")
    public ResponseEntity<Map<String, Object>> getOfficeByNo(@PathVariable int no) {
        Map<String, Object> officeInfo = officeService.getOfficeInfo(no);
        return ResponseEntity.ok(officeInfo);
    }

    @PutMapping("/office/{no}/accept")
    public ResponseEntity<String> acceptOffice(@PathVariable int no) {
        try {
            officeService.acceptOffice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/office/{no}/refuse")
    public ResponseEntity<Map<String, Object>> refuseOffice(@PathVariable int no) {
        try {
            officeService.refuseOffice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/office/{no}")
    public ResponseEntity<String> deleteOffices(@PathVariable int no) {
        try {
            officeService.deleteOffice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/review")
    public Map<String, Object> getAllOffices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return reviewService.getReviewsWithPagination(page, size, f, q);
    }

    @DeleteMapping("/review/{no}")
    public ResponseEntity<String> deleteReview(@PathVariable int no) {
        try {
            reviewService.deleteReview(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/booking")
    public Map<String, Object> getAllBookings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return bookingService.getBookingsWithPagination(page, size, f, q);
    }

    @GetMapping("/notice")
    public Map<String, Object> getAllNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return noticeService.getNoticesWithPagination(page, size, f, q);
    }

    @PutMapping("/notice/{no}")
    public ResponseEntity<String> updateNotice(@PathVariable("no") int no, @RequestBody Notice notice) {
        try {
            notice.setNo(no);
            noticeService.updateNotice(notice);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/notice/{no}")
    public ResponseEntity<String> deleteNotice(@PathVariable("no") int no) {
        try {
            noticeService.deleteNotice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/notice")
    public ResponseEntity<String> createNotice(@RequestBody Notice notice) {
        try {
            noticeService.createNotice(notice);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}