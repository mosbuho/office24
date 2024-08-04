package com.kh.backend.manager;

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
import org.springframework.web.multipart.MultipartFile;

import com.kh.backend.office.OfficeService;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService managerService;
    private final OfficeService officeService;

    public ManagerController(ManagerService managerService, OfficeService officeService) {
        this.managerService = managerService;
        this.officeService = officeService;
    }

    // 회원 가입 페이지
    @PostMapping("/register")
    public ResponseEntity<?> registerManager(@RequestBody Manager manager) {
        try {
            managerService.registerManager(manager);
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/idCheck")
    public ResponseEntity<String> idCheck(@RequestParam("id") String id) {
        if (managerService.idCheckManager(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 메인 페이지
    @GetMapping("/office/stats/{no}")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = officeService.getStatistics(no);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/office/status/{no}")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        return officeService.getOfficeStatusPaged(no, page, size);
    }

    // 오피스 관리 페이지
    @GetMapping("/office/{no}")
    public Map<String, Object> getAllOffices(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer availability,
            @RequestParam(required = false) String searchText) {

        return officeService.getAllOffices(no, page, size, availability, searchText);
    }

    @DeleteMapping("/office/delete/{no}")
    public ResponseEntity<Void> deleteOffice(@PathVariable int no) {
        officeService.deleteOffice(no);
        return ResponseEntity.ok().build();
    }

    // 오피스 등록 페이지
    @PostMapping("/office/register/{managerNo}")
    public ResponseEntity<String> registerOffice(@PathVariable("managerNo") int managerNo,
            @RequestParam("title") String title,
            @RequestParam("address") String address,
            @RequestParam("zipcode") String zipCode,
            @RequestParam("sido") String sido,
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("capacity") int capacity,
            @RequestParam("mainImage") MultipartFile mainImage,
            @RequestParam(value = "additionalImages[]", required = false) List<MultipartFile> additionalImages) {

        return officeService.registerOffice(managerNo, title, address, zipCode, sido, content, price, capacity,
                mainImage, additionalImages);
    }

    // 오피스 수정 페이지
    @GetMapping("/office/info/{officeNo}")
    public ResponseEntity<Map<String, Object>> getOfficeByNo(@PathVariable int officeNo) {
        Map<String, Object> officeInfo = officeService.getOfficeInfo(officeNo);
        return ResponseEntity.ok(officeInfo);
    }

    @PutMapping("/office/update/{no}/{officeNo}")
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

}