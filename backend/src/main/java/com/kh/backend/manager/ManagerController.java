package com.kh.backend.manager;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerManager(@RequestBody Manager manager) {
        try {
            managerService.registerManager(manager.getId(), manager.getPw(),
                    manager.getName(), manager.getPhone(), manager.getEmail());
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/idCheck")
    public ResponseEntity<String> idCheck(@RequestParam("id") String id) {
        if (managerService.idCheckManager(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
}