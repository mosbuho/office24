package com.kh.backend.manager;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ManagerMapper {
    void insertManager(Manager manager);
    Manager findById(String id);
}