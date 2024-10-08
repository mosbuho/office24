package com.kh.backend.controller;

import java.util.List;
import java.util.Map;

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
import org.springframework.web.multipart.MultipartFile;

import com.kh.backend.model.Manager;
import com.kh.backend.service.BookingService;
import com.kh.backend.service.ManagerService;
import com.kh.backend.service.OfficeService;
import com.kh.backend.service.RefundService;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService managerService;
    private final OfficeService officeService;
    private final BookingService bookingService;
    private final RefundService refundService;

    public ManagerController(ManagerService managerService, OfficeService officeService,
            BookingService bookingService, RefundService refundService) {
        this.managerService = managerService;
        this.officeService = officeService;
        this.bookingService = bookingService;
        this.refundService = refundService;
    }

    // 회원 가입 페이지
    @PostMapping("/create")
    public ResponseEntity<?> createManager(@RequestBody Manager manager) {
        try {
            managerService.createManager(manager);
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/id-check")
    public ResponseEntity<String> idCheck(@RequestParam("id") String id) {
        if (managerService.idCheckManager(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 메인 페이지
    @GetMapping("/{no}/office/stats")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = officeService.getStatistics(no);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{no}/office/status")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        return officeService.getOfficeStatusPaged(no, page, size);
    }

    @GetMapping("/{no}/booking/simple")
    public ResponseEntity<Map<String, Object>> getBookingsByManager(
            @PathVariable Integer no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        Map<String, Object> result = bookingService.getBookingsByManager(no, page, size);
        return ResponseEntity.ok(result);
    }

    // 오피스 관리 페이지
    @GetMapping("/{no}/office")
    public Map<String, Object> getAllOffices(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer availability,
            @RequestParam(required = false) String searchText) {

        return officeService.getAllOffices(no, page, size, availability, searchText);
    }

    @DeleteMapping("/office/{no}")
    public ResponseEntity<Void> deleteOffice(@PathVariable int no) {
        officeService.deleteOffice(no);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/office/{no}")
    public ResponseEntity<String> resubmitOffice(@PathVariable("no") int no) {
        try {
            officeService.resubmitOffice(no);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // 오피스 등록 페이지
    @PostMapping("/{managerNo}/office/create")
    public ResponseEntity<String> createOffice(@PathVariable("managerNo") int managerNo,
            @RequestParam("title") String title,
            @RequestParam("address") String address,
            @RequestParam("zipcode") String zipCode,
            @RequestParam("sido") String sido,
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("capacity") int capacity,
            @RequestParam("mainImage") MultipartFile mainImage,
            @RequestParam(value = "additionalImages[]", required = false) List<MultipartFile> additionalImages) {

        return officeService.createOffice(managerNo, title, address, zipCode, sido, content, price, capacity,
                mainImage, additionalImages);
    }

    // 오피스 수정 페이지
    @GetMapping("/office/{officeNo}/info")
    public ResponseEntity<Map<String, Object>> getOfficeByNo(@PathVariable int officeNo) {
        Map<String, Object> officeInfo = officeService.getOfficeInfo(officeNo);
        return ResponseEntity.ok(officeInfo);
    }

    @PutMapping("/{no}/office/{officeNo}/update")
    public ResponseEntity<String> updateOffice(@PathVariable("no") int managerNo,
            @PathVariable("officeNo") int officeNo,
            @RequestParam("title") String title,
            @RequestParam("address") String address,
            @RequestParam("zipcode") String zipCode,
            @RequestParam("sido") String sido,
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("capacity") int capacity,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "existingMainImage", required = false) String existingMainImage,
            @RequestParam(value = "additionalImages[]", required = false) List<MultipartFile> additionalImages,
            @RequestParam(value = "existingAdditionalImages[]", required = false) List<String> existingAdditionalImages) {

        return officeService.updateOffice(managerNo, officeNo, title, address, zipCode, sido, content, price, capacity,
                mainImage, existingMainImage, additionalImages, existingAdditionalImages);
    }

    // 예약 관리 페이지
    @GetMapping("/booking/{no}")
    public ResponseEntity<Map<String, Object>> getDetailedBookingsByManager(
            @PathVariable Integer no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(value = "filter", required = false) String filter,
            @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam(value = "sortOrder", required = false, defaultValue = "new") String sortOrder) {
        Map<String, Object> result = bookingService.getDetailedBookingsByManager(no, page, size, filter, searchText,
                sortOrder);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/booking/{bookingNo}")
    public ResponseEntity<Void> deleteBooking(@PathVariable int bookingNo) {
        bookingService.deleteBooking(bookingNo);
        return ResponseEntity.ok().build();
    }

    // 정보 관리 페이지
    @GetMapping("/info/{no}")
    public ResponseEntity<Manager> getManagerInfo(@PathVariable int no) {
        try {
            Manager manager = managerService.getManagerInfo(no);
            return ResponseEntity.ok(manager);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/update/{no}")
    @PreAuthorize("#no == authentication.details")
    public ResponseEntity<String> updateManagerInfo(@PathVariable int no,
            @RequestBody Map<String, Object> updatedData) {
        try {
            managerService.updateManagerInfo(no, updatedData);
            return ResponseEntity.ok("정보가 성공적으로 수정되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("정보 수정 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<String> findManagerIdByPhone(@RequestBody Manager manager) {
        try {
            String id = managerService.findManagerIdByPhone(manager);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-pw")
    public ResponseEntity<String> resetPassword(@RequestBody Manager manager) {
        try {
            boolean isReset = managerService.resetPassword(manager);
            if (isReset) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("아이디 또는 전화번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("비밀번호 재설정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{no}/refund")
    @PreAuthorize("#no == authentication.details")
    public ResponseEntity<Map<String, Object>> getRefunds(
            @PathVariable("no") int no,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {

        Map<String, Object> response = refundService.getRefundsByManagerNo(no, page, size);

        if (response.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

}