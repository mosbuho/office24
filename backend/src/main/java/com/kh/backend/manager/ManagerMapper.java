package com.kh.backend.manager;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ManagerMapper {
    // 등록
    void insertManager(Manager manager);
    // 조회
    Manager findById(String id);
}