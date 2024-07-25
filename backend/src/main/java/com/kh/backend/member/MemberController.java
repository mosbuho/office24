package com.kh.backend.member;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/registerProc")
    public ResponseEntity<Object> createMember(@Validated @RequestBody Member member, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
            boolean success = memberService.create(member);
            if (success) {
                return ResponseEntity.ok("회원가입 성공");
            } else {
                return ResponseEntity.ok("회원가입 실패");
            }
    }
    @GetMapping("/idDuplicate")
    public ResponseEntity<Object> idDuplicate(@RequestParam String id) {
        boolean success = memberService.idCheck(id);
        if (success) {
            return ResponseEntity.ok("아이디 중복확인 완료");
        } else {
            return ResponseEntity.ok("중복된 아이디입니다.");
        }
    }


}
