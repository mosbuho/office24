package com.kh.backend.member;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/idCheck")
    public ResponseEntity<String> idCheck(@RequestParam String id) {
        if (memberService.idCheck(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/idExist")
    public ResponseEntity<?> idExist(@RequestParam String phone) {
        System.out.println("Received phone number: " + phone); // 로그 추가
        String id = memberService.idExist(phone);
        System.out.println("Returned id: " + id); // 로그 추가
        if (id != null) {
            return ResponseEntity.ok(Collections.singletonMap("id", id));
        } else {
            return ResponseEntity.badRequest().body("아이디가 존재하지 않습니다.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member.getId(), member.getPw(),
                    member.getName(), member.getPhone(), member.getEmail(),
                    member.getBirth(), member.getGender());
            return ResponseEntity.ok(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
