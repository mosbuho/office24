package com.kh.backend.office;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    // 통계 메소드
    @GetMapping("/manager/office/stats/{no}")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", officeService.getTotalRevenue(no)); // 누적 수익
        stats.put("totalUsage", officeService.getTotalUsage(no)); // 누적 이용자
        stats.put("totalRating", officeService.getTotalRating(no)); // 총 평점 (보유한 전체 오피스)
        stats.put("totalActive", officeService.getActiveOfficeCount(no)); // 현재 이용 중인 숫자

        List<Map<String, Object>> monthlyRevenue = officeService.getMonthlyRevenue(no);
        stats.put("monthlyRevenue", monthlyRevenue); // 월 매출
        List<Map<String, Object>> genderRatio = officeService.getTotalGenderRatio(no);
        stats.put("genderRatio", genderRatio); // 이용자 성비
        Map<String, Object> officeStatus = getOfficeStatusPaged(no, 1, 100);
        stats.put("offices", officeStatus.get("offices")); // 오피스 등록 상태 (승인, 대기)
        return ResponseEntity.ok(stats);
    }

    // 오피스 상태 목록 조회 (페이지네이션)
    @GetMapping("/manager/office/status/{no}")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        List<Office> offices = officeService.getOfficeStatusPaged(no, page, size); // 오피스 목록
        int total = officeService.getOfficeStatusCount(no); // 오피스 수

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    // availability, searchText에 따라 오피스 목록 조회
    @GetMapping("/manager/office/{no}")
    public Map<String, Object> getAllOffices(@PathVariable int no, @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) Integer availability,
            @RequestParam(required = false) String searchText) {

        List<Office> offices = officeService.getOffices(no, page, size, availability, searchText); // 조건에 맞는 오피스 목록
        int total = officeService.getOfficeCount(no, availability, searchText); // 조건에 맞는 오피스 수

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    // 오피스 no로 오피스 정보 삭제
    @DeleteMapping("/manager/office/delete/{no}")
    public ResponseEntity<Void> deleteOffice(@PathVariable int no) {
        officeService.deleteOffice(no);
        return ResponseEntity.ok().build();
    }

    // 매니저 no로 오피스 등록
    @PostMapping("/manager/office/register/{managerNo}")
    public ResponseEntity<String> registerOffice(@PathVariable("managerNo") int managerNo,
            @RequestParam("title") String title,
            @RequestParam("address") String address,
            @RequestParam("zipcode") String zipCode,
            @RequestParam("sido") String sido,
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("capacity") int capacity,
            @RequestParam("mainImage") MultipartFile mainImage,
            @RequestParam(value = "additionalImages[]", required = false) List<MultipartFile> additionalImages)
            throws IOException {

        try {
            // sido 필드 "특별자치도" 제거 처리
            if (sido.endsWith("특별자치도")) {
                sido = sido.replace("특별자치도", "");
            }

            // 메인이미지 비동기 저장
            String mainImageName = saveImage(mainImage);

            // 오피스 객체 생성
            Office office = new Office();
            office.setManagerNo(managerNo);
            office.setTitle(title);
            office.setAddress(address);
            office.setZipCode(zipCode);
            office.setSido(sido);
            office.setContent(content);
            office.setPrice(price);
            office.setCapacity(capacity);
            office.setTitleImg(mainImageName);
            // 기타 이미지 처리
            List<String> additionalImageNames = new ArrayList<>();
            if (additionalImages != null && !additionalImages.isEmpty()) {
                for (MultipartFile file : additionalImages) {

                    if (!file.isEmpty()) {
                        try {
                            String additionalImageName = saveImage(file);
                            additionalImageNames.add(additionalImageName);
                        } catch (IOException e) {
                            e.printStackTrace();
                            throw e;
                        }
                    }
                }
            }
            // 오피스 테이블 삽입 + 오피스 이미지 테이블 삽입
            officeService.registerOffice(office, additionalImageNames); // 여기서 계속 널이 뜨네
            return ResponseEntity.ok("오피스가 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("오피스 등록 오류로 실패 : " + e.getMessage());
        }
    }

    // 이미지 저장 (UUID 사용)
    public String saveImage(MultipartFile image) throws IOException {
        // 원본 파일 이름을 가져오고 null 체크
        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("파일 이름을 가져올 수 없습니다.");
        }
        // 파일 이름에 UUID 추가 및 공백 제거
        String imageName = UUID.randomUUID().toString() + ".webp";

        // 프로젝트 루트 경로 기준 절대 경로 생성 (src 폴더와 동일한 위치에 img 폴더 생성)
        String uploadDir = new File(System.getProperty("user.dir")).getAbsolutePath() + "/img/";
        File destination = new File(uploadDir + imageName);
        try {
            image.transferTo(destination);
        } catch (IOException e) {
            System.err.println("파일 저장 중 오류 발생: " + e.getMessage());
            throw e;
        }

        return imageName;
    }

    @GetMapping("/admin/notavailability")
    public List<Office> getOfficeNotAvailability(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return officeService.getOfficeNotAvailability(page, size);
    }
}
