package com.kh.backend.office;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    @GetMapping("/manager/office/stats/{no}")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable int no) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", officeService.getTotalRevenue(no));
        stats.put("totalUsage", officeService.getTotalUsage(no));
        stats.put("totalRating", officeService.getTotalRating(no));
        stats.put("totalActive", officeService.getActiveOfficeCount(no));
        stats.put("monthlyRevenue", officeService.getMonthlyRevenue(no));
        stats.put("genderRatio", officeService.getTotalGenderRatio(no));
        stats.put("offices", getOfficeStatusPaged(no, 1, 100).get("offices"));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/manager/office/status/{no}")
    public Map<String, Object> getOfficeStatusPaged(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {

        List<Office> offices = officeService.getOfficeStatusPaged(no, page, size);
        int total = officeService.getOfficeStatusCount(no);

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    @GetMapping("/manager/office/{no}")
    public Map<String, Object> getAllOffices(@PathVariable int no,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer availability,
            @RequestParam(required = false) String searchText) {

        List<Office> offices = officeService.getOffices(no, page, size, availability, searchText);
        int total = officeService.getOfficeCount(no, availability, searchText);

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    @DeleteMapping("/manager/office/delete/{no}")
    public ResponseEntity<Void> deleteOffice(@PathVariable int no) {
        officeService.deleteOffice(no);
        return ResponseEntity.ok().build();
    }

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
            @RequestParam(value = "additionalImages[]", required = false) List<MultipartFile> additionalImages) {

        try {
            String mainImageName = saveImage(mainImage);

            Office office = new Office();
            office.setManager_no(managerNo);
            office.setTitle(title);
            office.setAddress(address);
            office.setZipCode(zipCode);
            office.setSido(sido.endsWith("특별자치도") ? sido.replace("특별자치도", "") : sido);
            office.setContent(content);
            office.setPrice(price);
            office.setCapacity(capacity);
            office.setTitleImg(mainImageName);

            List<String> additionalImageNames = new ArrayList<>();
            if (additionalImages != null) {
                for (MultipartFile file : additionalImages) {
                    if (!file.isEmpty()) {
                        additionalImageNames.add(saveImage(file));
                    }
                }
            }

            officeService.registerOffice(office, additionalImageNames);
            return ResponseEntity.ok("오피스가 성공적으로 등록되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오피스 등록 오류: " + e.getMessage());
        }
    }

    @GetMapping("/img/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("img/" + filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/manager/office/update/{no}/{officeNo}")
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

        try {
            Office office = new Office();
            office.setNo(officeNo);
            office.setManager_no(managerNo);
            office.setTitle(title);
            office.setAddress(address);
            office.setZipCode(zipCode);
            office.setSido(sido.endsWith("특별자치도") ? sido.replace("특별자치도", "") : sido);
            office.setContent(content);
            office.setPrice(price);
            office.setCapacity(capacity);

            if (mainImage != null && !mainImage.isEmpty()) {
                String mainImageName = saveImage(mainImage);
                officeService.deleteImageFile(existingMainImage);
                office.setTitleImg(mainImageName);
            } else {
                office.setTitleImg(existingMainImage);
            }

            List<String> additionalImageNames = new ArrayList<>(
                    existingAdditionalImages != null ? existingAdditionalImages : new ArrayList<>());

            if (additionalImages != null) {
                for (MultipartFile file : additionalImages) {
                    if (!file.isEmpty()) {
                        additionalImageNames.add(saveImage(file));
                    }
                }
            }

            officeService.updateOffice(office, additionalImageNames);
            return ResponseEntity.ok("오피스가 성공적으로 수정되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오피스 수정 중 오류: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            throw new IOException("빈 파일은 저장할 수 없습니다.");
        }

        String imageName = UUID.randomUUID().toString() + ".webp";
        String uploadDir = System.getProperty("user.dir") + "/img/";
        File destination = new File(uploadDir + imageName);
        image.transferTo(destination);

        return imageName;
    }

    @GetMapping("/admin/notavailability")
    public List<Office> getOfficeNotAvailability(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return officeService.getOfficeNotAvailability(page, size);
    }
}