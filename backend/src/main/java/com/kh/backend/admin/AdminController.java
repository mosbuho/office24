package com.kh.backend.admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.backend.manager.Manager;
import com.kh.backend.manager.ManagerService;
import com.kh.backend.member.Member;
import com.kh.backend.member.MemberService;
import com.kh.backend.office.Office;
import com.kh.backend.office.OfficeService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private ManagerService managerService;

    @Autowired
    private OfficeService officeService;

    @GetMapping("/member")
    public Map<String, Object> getAllMembers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return memberService.getMembersWithPagination(page, size, f, q);
    }

    @PostMapping("/member/{no}/reset-pw")
    public ResponseEntity<String> resetMemberPw(@PathVariable("no") int no) {
        try {
            memberService.resetMemberPw(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/member/{no}")
    public ResponseEntity<String> updateMember(@PathVariable("no") int no, @RequestBody Member member) {
        try {
            member.setNo(no);
            memberService.updateMember(member);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/member/{no}")
    public ResponseEntity<String> deleteMember(@PathVariable("no") int no) {
        try {
            memberService.deleteMember(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/manager")
    public Map<String, Object> getAllManagers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return managerService.getManagersWithPagination(page, size, f, q);
    }

    @PostMapping("/manager/{no}/reset-pw")
    public ResponseEntity<String> resetManagerPw(@PathVariable("no") int no) {
        try {
            managerService.resetManagerPw(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/manager/{no}")
    public ResponseEntity<String> updateManager(@PathVariable("no") int no, @RequestBody Manager manager) {
        try {
            manager.setNo(no);
            managerService.updateManager(manager);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/manager/{no}")
    public ResponseEntity<String> deleteManager(@PathVariable("no") int no) {
        try {
            managerService.deleteManager(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/office")
    public Map<String, Object> getAllOffices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer availability) {
        return officeService.adminGetOfficesWithPagination(page, size, f, q, availability);
    }

    @GetMapping("/notavailability")
    public List<Office> getOfficeNotAvailability(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return officeService.getOfficeNotAvailability(page, size);
    }

    @GetMapping("/office/{no}")
    public ResponseEntity<Map<String, Object>> getOfficeByNo(@PathVariable int no) {
        Map<String, Object> officeInfo = officeService.getOfficeInfo(no);
        return ResponseEntity.ok(officeInfo);
    }

    @PutMapping("/office/{no}/accept")
    public ResponseEntity<String> acceptOffice(@PathVariable int no) {
        try {
            officeService.acceptOffice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/office/{no}/refuse")
    public ResponseEntity<Map<String, Object>> refuseOffice(@PathVariable int no) {
        try {
            officeService.refuseOffice(no);
            System.out.println(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/office/{no}")
    public ResponseEntity<String> deleteOffices(@PathVariable int no) {
        try {
            officeService.deleteOffice(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}