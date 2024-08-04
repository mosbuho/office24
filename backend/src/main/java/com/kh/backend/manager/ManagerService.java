package com.kh.backend.manager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerService {
    private final ManagerMapper managerMapper;
    private final PasswordEncoder passwordEncoder;

    public ManagerService(ManagerMapper managerMapper, PasswordEncoder passwordEncoder) {
        this.managerMapper = managerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerManager(Manager manager) {
        manager.setPw(passwordEncoder.encode(manager.getPw()));
        try {
            managerMapper.insertManager(manager);
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

}