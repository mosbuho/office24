package com.kh.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.backend.mapper.ManagerMapper;
import com.kh.backend.model.Manager;

@Service
public class ManagerService {
    private final ManagerMapper managerMapper;
    private final PasswordEncoder passwordEncoder;

    public ManagerService(ManagerMapper managerMapper, PasswordEncoder passwordEncoder) {
        this.managerMapper = managerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createManager(Manager manager) {
        manager.setPw(passwordEncoder.encode(manager.getPw()));
        try {
            managerMapper.createManager(manager);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("알 수 없는 오류가 발생했습니다.");
        }
    }

    public boolean idCheckManager(String id) {
        return managerMapper.findById(id) == null;
    }

    public Map<String, Object> getManagersWithPagination(int page, int size, String f, String q) {
        int start = (page - 1) * size + 1;
        int end = page * size;
        List<Manager> manager = managerMapper.getAllManagers(start, end, f, q);
        int totalCount = managerMapper.getTotalManagerCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("manager", manager);
        response.put("totalCount", totalCount);
        return response;
    }

    public void resetManagerPw(int no) {
        managerMapper.resetManagerPw(no);
    }

    public void updateManager(Manager manager) {
        managerMapper.updateManager(manager);
    }

    public void deleteManager(int no) {
        managerMapper.deleteManager(no);
    }

    public Manager getManagerInfo(int no) {
        return managerMapper.getManagerInfo(no);
    }

    @Transactional
    public void updateManagerInfo(int no, Map<String, Object> updatedData) {
        updatedData.put("no", no);

        if (updatedData.containsKey("pw")) {
            String rawPassword = (String) updatedData.get("pw");
            String encodedPassword = passwordEncoder.encode(rawPassword);
            updatedData.put("pw", encodedPassword);
        }
        managerMapper.updateManagerInfo(updatedData);
    }

    public String findManagerIdByPhone(Manager manager) {
        String id = managerMapper.findManagerIdByPhone(manager.getPhone());
        if (id == null) {
            throw new RuntimeException("해당 전화번호로 등록된 아이디가 없습니다.");
        }
        return id;
    }

    public boolean resetPassword(Manager manager) {
        String encodedPw = passwordEncoder.encode(manager.getPw());
        managerMapper.updateManagerPassword(manager.getId(), encodedPw);
        return true;
    }

}