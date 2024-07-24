package com.kh.backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Member {
    private int no;
    @NotBlank
    private String id;
    @NotBlank
    @Size(min = 8, max = 16, message = "6자 이상 12자 이하 한글x")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$",
            message = "비밀번호는 8자에서 16자 사이여야 하며, 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다")
    private String pw;
    @NotBlank
    @Size(min = 2, max = 12, message = "이름은 2자에서 12자 사이여야 합니다.")
    @Pattern(regexp = "^[^A-Za-z]+$", message = "이름에는 영어 문자가 포함될 수 없습니다.")
    private String name;
    @NotBlank
    private String phone;
    @NotBlank
    private String email;
    @NotNull
    private Date birth;
    @NotNull
    private String gender;
    @NotNull
    private Date regDate;
    List<MemberAuth> authList;
}
