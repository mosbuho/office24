package com.kh.backend.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.kh.backend.model.Admin;

@Mapper
public interface AdminMapper {
    void insertAdmin(Admin admin);

    Admin findById(String id);
}