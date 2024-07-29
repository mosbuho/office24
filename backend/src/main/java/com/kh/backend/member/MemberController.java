package com.kh.backend.member;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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
    @GetMapping("/kakao/login-url")
    public ResponseEntity<String> getKakaoLoginUrl() {
        String kakaoLoginUrl = memberService.getKakaoLoginUrl();
        return ResponseEntity.ok(kakaoLoginUrl);
    }

    @GetMapping("/kakao/callback")
    public void kakaoCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
        try {
            Member member = memberService.findOrCreateKakaoUser(code);
            response.sendRedirect("http://localhost:5173/login?message=success");
        } catch (Exception e) {
            response.sendRedirect("http://localhost:5173/login?message=error");
        }
    }
    @GetMapping("/naver/login-url")
    public ResponseEntity<String> getNaverLoginUrl() {
        String naverLoginUrl = memberService.getNaverLoginUrl();
        return ResponseEntity.ok(naverLoginUrl);
    }

    @GetMapping("/naver/callback")
    public void naverCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
        try {
            Member member = memberService.findOrCreateNaverUser(code);
            response.sendRedirect("http://localhost:5173/login?message=success");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:5173/login?message=error");
        }
    }
}
