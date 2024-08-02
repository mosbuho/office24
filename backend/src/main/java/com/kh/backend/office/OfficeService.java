package com.kh.backend.office;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OfficeService {
    @Autowired
    private OfficeMapper officeMapper;

    public List<Office> getOfficeNotAvailability(int page, int size) {
        Map<String, Integer> params = new HashMap<>();
        params.put("start", (page - 1) * size + 1);
        params.put("end", page * size);
        return officeMapper.getOfficeNotAvailability(params);
    }
}