package com.kh.backend.manager;

import org.springframework.stereotype.Service;

@Service
public class ManagerService {
    private final ManagerMapper managerMapper;

    public ManagerService(ManagerMapper managerMapper) {
        this.managerMapper = managerMapper;
    }


}