package com.kh.backend.member;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }
    @GetMapping("/idCheck")
    public ResponseEntity<String> idCheck(@RequestParam String id) {
        if (memberService.idCheck(id))  {
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
}