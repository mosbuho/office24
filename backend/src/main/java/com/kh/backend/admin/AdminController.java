package com.kh.backend.admin;

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

import com.kh.backend.member.Member;
import com.kh.backend.member.MemberService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private MemberService memberService;

    @GetMapping("/member")
    public Map<String, Object> getAllMembers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size) {
        return memberService.getMembersWithPagination(page, size);
    }

    @PostMapping("/member/{no}/reset-pw")
    public ResponseEntity<String> resetPassword(@PathVariable("no") int no) {
        try {
            memberService.resetPassword(no);
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
}
