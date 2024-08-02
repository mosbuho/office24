package com.kh.backend.office;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // 누적 수익
    public Integer getTotalRevenue(Integer no) {
        return officeMapper.getTotalRevenue(no);
    }

    // 누적 이용자수
    public Integer getTotalUsage(Integer no) {
        return officeMapper.getTotalUsage(no);
    }

    // 총 평점
    public Double getTotalRating(Integer no) {
        return officeMapper.getTotalRating(no);
    }

    // 현재 이용 중인 오피스 개수
    public Integer getActiveOfficeCount(Integer no) {
        return officeMapper.getActiveOfficeCount(no);
    }

    // 월별 수익 데이터
    public List<Map<String, Object>> getMonthlyRevenue(Integer no) {
        return officeMapper.getMonthlyRevenue(no);
    }

    // 성비
    public List<Map<String, Object>> getTotalGenderRatio(Integer no) {
        return officeMapper.getTotalGenderRatio(no);
    }

    // 등록 상태에 따른 오피스 목록
    public List<Office> getOfficeStatusPaged(int no, int page, int size) {
        int offset = (page - 1) * size;
        return officeMapper.getOfficeStatusPaged(no, offset, size);
    }

    // 등록 상태에 따른 오피스 개수
    public Integer getOfficeStatusCount(int no) {
        return officeMapper.getOfficeStatusCount(no);
    }

    // 전체 목록 조회
    public List<Office> getOffices(int no, int page, int size, Integer availability, String searchText) {
        int offset = (page - 1) * size;
        return officeMapper.getOffices(no, offset, size, availability, searchText);
    }

    // 전체 개수 조회
    public Integer getOfficeCount(int no, Integer availability, String searchText) {
        return officeMapper.getOfficeCount(no, availability, searchText);
    }

    // 오피스 no로 오피스 정보 삭제
    public void deleteOffice(int no) {
        officeMapper.deleteOffice(no);
    }

    @Transactional
    public void registerOffice(Office office, List<String> additionalImages) {
        // 주소로부터 위도와 경도 추출
        double[] latLong = geocodingService.getLatLongFromAddress(office.getAddress());
        office.setLatitude(latLong[0]);
        office.setLongitude(latLong[1]);

        // 오피스 등록
        try {
            officeMapper.insertOffice(office);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("오피스 등록 완료. officeNo: " + office.getNo());

        // 추가 이미지 처리
        if (additionalImages != null && !additionalImages.isEmpty()) {
            for (String imageName : additionalImages) {
                OfficeImage officeImage = new OfficeImage();
                officeImage.setOfficeNo(office.getNo());
                officeImage.setName(imageName);
                // 기타 오피스 이미지 등록
                officeMapper.insertOfficeImage(officeImage);
            }
        }
    }

    public List<Office> getOfficeNotAvailability(int page, int size) {
        Map<String, Integer> params = new HashMap<>();
        params.put("start", (page - 1) * size + 1);
        params.put("end", page * size);
        return officeMapper.getOfficeNotAvailability(params);
    }
}
