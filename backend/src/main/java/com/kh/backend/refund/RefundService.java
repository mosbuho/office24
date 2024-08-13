package com.kh.backend.refund;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefundService {

    @Autowired
    private RefundMapper refundMapper;

    public Map<String, Object> getRefundsWithPagination(int page, int size, String f, String q) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Refund> refunds = refundMapper.getAllRefunds(start, end, f, q);
        int totalCount = refundMapper.getTotalRefundCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("refunds", refunds);
        response.put("totalCount", totalCount);
        return response;
    }
    
    public Map<String, Object> getRefundsByManagerNo(int no, int page, int size) {
        int offset = (page - 1) * size;
        List<Map<String, Object>> refunds = refundMapper.getRefundsByManagerNo(no, offset, size);
        int total = refundMapper.getRefundsCountByManagerNo(no);

        Map<String, Object> response = new HashMap<>();
        response.put("refunds", refunds);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }
}