package com.kh.backend.office;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OfficeMapper {
    List<Office> getOfficeNotAvailability(Map<String, Integer> params);
}