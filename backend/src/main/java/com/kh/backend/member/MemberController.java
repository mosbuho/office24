package com.kh.backend.member;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

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

    @GetMapping("/checkId")
    public ResponseEntity<?> checkId(@RequestParam String id) {
        if (!memberService.idCheck(id)) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member.getId(), member.getPw(),
                    member.getName(), member.getPhone(), member.getEmail(),
                    member.getBirth(), member.getGender());
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/resetPw")
    public ResponseEntity<?> resetPw(@RequestBody Map<String, String> map) {
        String pw = map.get("pw");
        String id = map.get("id");
        System.out.println("pw="+pw);
        System.out.println("id="+id);

        boolean result = memberService.resetPw(pw, id);
        if (result) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
