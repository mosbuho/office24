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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kh.backend.common.geocoding.GeocodingService;

@Service
public class OfficeService {

    @Autowired
    private OfficeMapper officeMapper;

    @Autowired
    private GeocodingService geocodingService;

    public Map<String, Object> getStatistics(int no) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", getTotalRevenue(no));
        stats.put("totalUsage", getTotalUsage(no));
        stats.put("totalRating", getTotalRating(no));
        stats.put("totalActive", getActiveOfficeCount(no));
        stats.put("monthlyRevenue", getMonthlyRevenue(no));
        stats.put("genderRatio", getTotalGenderRatio(no));
        stats.put("offices", getOfficeStatusPaged(no, 1, 100).get("offices"));

        return stats;
    }

    public Integer getTotalRevenue(Integer no) {
        return officeMapper.getTotalRevenue(no);
    }

    public Integer getTotalUsage(Integer no) {
        return officeMapper.getTotalUsage(no);
    }

    public Double getTotalRating(Integer no) {
        return officeMapper.getTotalRating(no);
    }

    public Integer getActiveOfficeCount(Integer no) {
        return officeMapper.getActiveOfficeCount(no);
    }

    public List<Map<String, Object>> getMonthlyRevenue(Integer no) {
        return officeMapper.getMonthlyRevenue(no);
    }

    public List<Map<String, Object>> getTotalGenderRatio(Integer no) {
        return officeMapper.getTotalGenderRatio(no);
    }

    public Map<String, Object> getOfficeStatusPaged(int no, int page, int size) {
        int offset = (page - 1) * size;
        List<Office> offices = officeMapper.getOfficeStatusPaged(no, offset, size);
        int total = officeMapper.getOfficeStatusCount(no);

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    public Map<String, Object> getAllOffices(int no, int page, int size, Integer availability, String searchText) {
        int offset = (page - 1) * size;
        List<Office> offices = officeMapper.getOffices(no, offset, size, availability, searchText);
        int total = officeMapper.getOfficeCount(no, availability, searchText);

        Map<String, Object> response = new HashMap<>();
        response.put("offices", offices);
        response.put("total", total);
        response.put("page", page);
        response.put("size", size);

        return response;
    }

    public void deleteOffice(int no) {
        officeMapper.deleteOffice(no);
    }

    @Transactional
    public ResponseEntity<String> registerOffice(int managerNo, String title, String address, String zipCode,
            String sido, String content, int price, int capacity, MultipartFile mainImage,
            List<MultipartFile> additionalImages) {
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

            registerOffice(office, additionalImageNames);
            return ResponseEntity.ok("오피스가 성공적으로 등록되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오피스 등록 오류: " + e.getMessage());
        }
    }

    @Transactional
    public void registerOffice(Office office, List<String> additionalImages) {
        double[] latLong = geocodingService.getLatLongFromAddress(office.getAddress());
        office.setLatitude(latLong[0]);
        office.setLongitude(latLong[1]);

        officeMapper.insertOffice(office);

        if (additionalImages != null && !additionalImages.isEmpty()) {
            additionalImages.forEach(imageName -> {
                OfficeImage officeImage = new OfficeImage();
                officeImage.setOfficeNo(office.getNo());
                officeImage.setName(imageName);
                officeMapper.insertOfficeImage(officeImage);
            });
        }
    }

    public ResponseEntity<Resource> serveImage(String filename) {
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

    public Map<String, Object> getOfficeInfo(int officeNo) {
        Office office = officeMapper.getOfficeByNo(officeNo);
        List<String> additionalImageUrls = officeMapper.getOfficeImagesByOfficeNo(officeNo);

        Map<String, Object> response = new HashMap<>();
        response.put("title", office.getTitle());
        response.put("price", office.getPrice());
        response.put("address", office.getAddress());
        response.put("zipCode", office.getZipCode());
        response.put("sido", office.getSido());
        response.put("content", office.getContent());
        response.put("capacity", office.getCapacity());
        response.put("titleImg", office.getTitleImg());
        response.put("additionalImageUrls", additionalImageUrls);

        return response;
    }

    @Transactional
    public ResponseEntity<String> updateOffice(int managerNo, int officeNo, String title, String address,
            String zipCode, String sido, String content, int price, int capacity, MultipartFile mainImage,
            String existingMainImage, List<MultipartFile> additionalImages, List<String> existingAdditionalImages) {
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
                deleteImageFile(existingMainImage);
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

            updateOffice(office, additionalImageNames);
            return ResponseEntity.ok("오피스가 성공적으로 수정되었습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오피스 수정 중 오류: " + e.getMessage());
        }
    }

    @Transactional
    public void updateOffice(Office office, List<String> newImageNames) {
        double[] latLong = geocodingService.getLatLongFromAddress(office.getAddress());
        office.setLatitude(latLong[0]);
        office.setLongitude(latLong[1]);

        officeMapper.updateOffice(office);
        List<String> existingImageNames = officeMapper.getOfficeImagesByOfficeNo(office.getNo());
        List<String> imagesToKeep = new ArrayList<>(existingImageNames);

        if (newImageNames != null) {
            newImageNames.forEach(newImage -> {
                if (!existingImageNames.contains(newImage)) {
                    OfficeImage officeImage = new OfficeImage();
                    officeImage.setOfficeNo(office.getNo());
                    officeImage.setName(newImage);
                    officeMapper.insertOfficeImage(officeImage);
                } else {
                    imagesToKeep.remove(newImage);
                }
            });

            imagesToKeep.forEach(oldImage -> {
                officeMapper.deleteOfficeImage(office.getNo(), oldImage);
                deleteImageFile(oldImage);
            });
        }
    }

    public boolean deleteImageFile(String imageName) {
        String uploadDir = System.getProperty("user.dir") + "/img/";
        File file = new File(uploadDir + imageName);

        return file.exists() && file.delete();
    }

    public List<Office> getOfficeNotAvailability(int page, int size) {
        Map<String, Integer> params = new HashMap<>();
        params.put("start", (page - 1) * size + 1);
        params.put("end", page * size);

        return officeMapper.getOfficeNotAvailability(params);
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

    public Map<String, Object> adminGetOfficesWithPagination(int page, int size, String f, String q,
            Integer availability) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Office> office = officeMapper.adminGetAllOffices(start, end, f, q, availability);
        int totalCount = officeMapper.adminGetTotalOfficeCount(f, q, availability);

        Map<String, Object> response = new HashMap<>();
        response.put("office", office);
        response.put("totalCount", totalCount);
        return response;
    }


    public void acceptOffice(int no) {
        officeMapper.acceptOffice(no);
    }

    public void refuseOffice(int no) {
        officeMapper.refuseOffice(no);
    }

    public List<Map<String, Object>> getOfficeList(int page, int size, String location, String startDate, String endDate, int attendance) {
        int startRow = (page - 1) * size;
        int endRow = startRow + size;
    try {
        return officeMapper.selectOfficeList(startRow, endRow, location, startDate, endDate, attendance);
    } catch (Exception e) {
        // Log the error
        e.printStackTrace();
        // You might want to throw a custom exception here or return an empty list
        return new ArrayList<>();
    }
}
}