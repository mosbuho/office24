package com.kh.backend.member;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class MemberService {
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    public MemberService(MemberMapper memberMapper, PasswordEncoder passwordEncoder) {
        this.memberMapper = memberMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean idCheck(String id) {
        return memberMapper.findById(id) == null;
    }

    public List<String> idExist(String phone) {
        List<String> ids = memberMapper.findIdByPhone(phone);
        return ids;
    }

    @Transactional
    public void registerMember(String id, String pw, String name, String phone, String email, Date birth, String gender) {
        Member member = new Member();
        member.setId(id);
        member.setPw(passwordEncoder.encode(pw));
        member.setName(name);
        member.setPhone(phone);
        member.setEmail(email);
        member.setBirth(birth);
        member.setGender(gender);

        try {
            memberMapper.insertMember(member);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            throw new RuntimeException("알 수 없는 오류가 발생했습니다.", e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("회원 등록 중 오류가 발생했습니다.", e);
        }
    }

    public String getKakaoLoginUrl() {
        return "https://kauth.kakao.com/oauth/authorize?client_id=" + kakaoClientId + "&redirect_uri=" + kakaoRedirectUri + "&response_type=code";
    }

    public String getKakaoAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new FormHttpMessageConverter());

        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);
        params.add("client_secret", kakaoClientSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }

    public Member getKakaoUser(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

            Member member = new Member();
            member.setId((String.valueOf(responseBody.get("id"))));
            member.setEmail((String) kakaoAccount.get("email"));
            member.setName((String) kakaoAccount.get("name"));
            member.setGender((kakaoAccount.get("gender")).equals("male") ? "M" : "W");
            member.setPhone(((String) kakaoAccount.get("phone_number")).replace("+82 ", "0").replace("-", ""));

            String birthYear = (String) kakaoAccount.get("birthyear");
            String birthDay = (String) kakaoAccount.get("birthday");
            if (birthYear != null && birthDay != null) {
                String birthDateStr = birthYear + birthDay;
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
                try {
                    Date birthDate = dateFormat.parse(birthDateStr);
                    member.setBirth(birthDate);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            return member;
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }

    public Member findOrCreateKakaoUser(String code) {
        String accessToken = getKakaoAccessToken(code);
        Member kakaoUser = getKakaoUser(accessToken);

        Member member = memberMapper.findByEmail(kakaoUser.getEmail());
        if (member == null) {
            String pw = "office24";
            registerMember(kakaoUser.getEmail(), pw, kakaoUser.getName(), kakaoUser.getPhone(),
                    kakaoUser.getEmail(), kakaoUser.getBirth(), kakaoUser.getGender());
            member = memberMapper.findByEmail(kakaoUser.getEmail());
        }
        return member;
    }

    public String getNaverLoginUrl() {
        String clientId = naverClientId;
        String redirectUri = naverRedirectUri;
        return "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirectUri;
    }

    public String getNaverAccessToken(String code) {
        String clientId = naverClientId;
        String clientSecret = naverClientSecret;

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new FormHttpMessageConverter());

        String url = "https://nid.naver.com/oauth2.0/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("state", UUID.randomUUID().toString());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }

    public Member getNaverUser(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> responseBodyObj = (Map<String, Object>) responseBody.get("response");

            Member member = new Member();
            member.setId(responseBodyObj.get("id").toString());
            member.setEmail((String) responseBodyObj.get("email"));
            member.setName((String) responseBodyObj.get("name"));
            member.setGender((String) responseBodyObj.get("gender"));
            member.setPhone(((String) responseBodyObj.get("mobile")).replace("-",""));

            String birth = (String) responseBodyObj.get("birthday");
            String birthYear = (String) responseBodyObj.get("birthyear");

            if (birth != null && birthYear != null) {
                String birthDateStr = birthYear + "-" + birth;
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date birthDate = dateFormat.parse(birthDateStr);
                    member.setBirth(birthDate);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            return member;
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }
    public Member findOrCreateNaverUser(String code) {
        String accessToken = getNaverAccessToken(code);
        Member naverUser = getNaverUser(accessToken);

        Member member = memberMapper.findByEmail(naverUser.getEmail());
        if (member == null) {
            String generatedPw = "office24";
            registerMember(naverUser.getEmail(), generatedPw, naverUser.getName(), naverUser.getPhone(),
                    naverUser.getEmail(), naverUser.getBirth(), naverUser.getGender());
            member = memberMapper.findByEmail(naverUser.getEmail());
        }
        return member;
    }

    public String getGoogleLoginUrl() {
        return "https://accounts.google.com/o/oauth2/auth?client_id=" + googleClientId
                + "&redirect_uri=" + googleRedirectUri
                + "&response_type=code"
                + "&scope=profile email https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read";
    }


    public String getGoogleAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new FormHttpMessageConverter());

        String url = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", googleRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            return (String) responseBody.get("access_token");
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }

    public Member getGoogleUser(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://people.googleapis.com/v1/people/me?personFields=birthdays,phoneNumbers,genders,emailAddresses,names";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();

            Member member = new Member();
            member.setId((String) responseBody.get("resourceName"));

            List<Map<String, Object>> emails = (List<Map<String, Object>>) responseBody.get("emailAddresses");
            if (emails != null && !emails.isEmpty()) {
                member.setEmail((String) emails.get(0).get("value"));
            }

            List<Map<String, Object>> names = (List<Map<String, Object>>) responseBody.get("names");
            if (names != null && !names.isEmpty()) {
                member.setName((String) names.get(0).get("displayName"));
            }

            List<Map<String, Object>> genders = (List<Map<String, Object>>) responseBody.get("genders");
            if (genders != null && !genders.isEmpty()) {
                member.setGender("male".equals(genders.get(0).get("value")) ? "M" : "W");
            } else {
                member.setGender("U");
            }

            List<Map<String, Object>> phones = (List<Map<String, Object>>) responseBody.get("phoneNumbers");
            if (phones != null && !phones.isEmpty()) {
                String phone = (String) phones.get(0).get("value");
                if (phone != null) {
                    phone = phone.replaceAll("[^0-9]", "");
                    member.setPhone(phone);
                }
            }

            List<Map<String, Object>> birthdays = (List<Map<String, Object>>) responseBody.get("birthdays");
            if (birthdays != null && !birthdays.isEmpty()) {
                Map<String, Object> birthdayData = birthdays.get(0);
                Map<String, Object> date = (Map<String, Object>) birthdayData.get("date");
                if (date != null) {
                    Integer year = (Integer) date.get("year");
                    Integer month = (Integer) date.get("month");
                    Integer day = (Integer) date.get("day");

                    if (year != null && month != null && day != null) {
                        String birthDateString = String.format("%04d-%02d-%02d", year, month, day);

                        try {
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            Date birthDate = sdf.parse(birthDateString);

                            member.setBirth(birthDate);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
            return member;
        } else {
            throw new RuntimeException(response.getBody().toString());
        }
    }
    public Member findOrCreateGoogleUser(String code) {
        String accessToken = getGoogleAccessToken(code);
        Member googleUser = getGoogleUser(accessToken);

        Member member = memberMapper.findByEmail(googleUser.getEmail());
        if (member == null) {
            String pw = "office24";
            registerMember(googleUser.getEmail(), pw, googleUser.getName(), googleUser.getPhone(),
                    googleUser.getEmail(), googleUser.getBirth(), googleUser.getGender());
            member = memberMapper.findByEmail(googleUser.getEmail());
        }
        return member;
    }
    public boolean resetPw(String pw, String id)    {
        try {
            memberMapper.resetPw(passwordEncoder.encode(pw), id);
            return true;
        } catch (Exception e)   {
            e.printStackTrace();
            return false;
        }
    }
}
