package com.kh.backend.office;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class OfficeService {

    @Autowired
    private OfficeMapper officeMapper;

    // 누적 수익
    public Long getTotalRevenue(Long no) {
        return officeMapper.getTotalRevenue(no);
    }

    // 누적 이용자수
    public Long getTotalUsage(Long no) {
        return officeMapper.getTotalUsage(no);
    }

    // 총 평점
    public Double getTotalRating(Long no) {
        return officeMapper.getTotalRating(no);
    }

    // 현재 이용 중인 오피스 개수
    public Integer getActiveOfficeCount(Long no) {
        return officeMapper.getActiveOfficeCount(no);
    }

    // 월별 수익 데이터
    public List<Map<String, Object>> getMonthlyRevenue(Long no) {
        return officeMapper.getMonthlyRevenue(no);
    }

    // 성비
    public List<Map<String, Object>> getTotalGenderRatio(Long no) {
        return officeMapper.getTotalGenderRatio(no);
    }
}
