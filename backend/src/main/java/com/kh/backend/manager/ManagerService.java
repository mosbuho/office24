package com.kh.backend.manager;

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
}