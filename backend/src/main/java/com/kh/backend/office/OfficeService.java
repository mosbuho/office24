package com.kh.backend.office;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.backend.common.geocoding.GeocodingService;

@Service
public class OfficeService {

    @Autowired
    private OfficeMapper officeMapper;

    @Autowired
    private GeocodingService geocodingService;

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

    public List<Office> getOfficeStatusPaged(int no, int page, int size) {
        int offset = (page - 1) * size;
        return officeMapper.getOfficeStatusPaged(no, offset, size);
    }

    public int getOfficeStatusCount(int no) {
        return officeMapper.getOfficeStatusCount(no);
    }

    public List<Office> getOffices(int no, int page, int size, Integer availability, String searchText) {
        int offset = (page - 1) * size;
        return officeMapper.getOffices(no, offset, size, availability, searchText);
    }

    public int getOfficeCount(int no, Integer availability, String searchText) {
        return officeMapper.getOfficeCount(no, availability, searchText);
    }

    public void deleteOffice(int no) {
        officeMapper.deleteOffice(no);
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

    public Office getOfficeByNo(int officeNo) {
        return officeMapper.getOfficeByNo(officeNo);
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
        }

        imagesToKeep.forEach(oldImage -> {
            officeMapper.deleteOfficeImage(office.getNo(), oldImage);
            deleteImageFile(oldImage);
        });
    }

    public List<String> getOfficeImagesByOfficeNo(int officeNo) {
        return officeMapper.getOfficeImagesByOfficeNo(officeNo);
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
}
