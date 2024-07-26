package com.kh.backend.admin;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminMapper {
    void insertAdmin(Admin admin);

    Admin findById(String id);
}