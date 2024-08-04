package com.kh.backend.manager;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ManagerMapper {
    void insertManager(Manager manager);

    Manager findById(String id);

    List<Manager> getAllManagers(@Param("start") int start, @Param("end") int end,
            @Param("f") String f, @Param("q") String q);

    int getTotalManagerCount(@Param("f") String f, @Param("q") String q);

    void resetManagerPw(int no);

    void updateManager(Manager manager);

    void deleteManager(int no);
}