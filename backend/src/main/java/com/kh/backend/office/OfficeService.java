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

    public List<Office> getOfficeStatus(Integer no) {
        return officeMapper.getOfficeStatus(no);
    }
}
