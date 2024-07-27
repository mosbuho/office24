package com.kh.backend.common.message;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;

@RestController
@RequestMapping("/message")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    final DefaultMessageService messageService;

    @Value("${coolsms.fromnumber}")
    private String fromNumber;

    public MessageController(
            @Value("${coolsms.apikey}") String apiKey,
            @Value("${coolsms.apisecret}") String apiSecret) {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }

    // 인증 코드 전송
    @PostMapping("/send-one")
    public void sendOne(@RequestBody MessageRequest messageRequest, HttpSession session) {
        String code = generateRandomCode();
        session.setAttribute("verificationCode", code);

        Message message = new Message();
        message.setFrom(fromNumber);
        message.setTo(messageRequest.getTo());
        message.setText("[Office24] 인증코드 (" + code + ")를 입력해주세요");

        try {
            messageService.send(message);
            System.out.println("메시지 전송 성공");
            System.out.println("생성된 인증 코드: " + code);
        } catch (NurigoMessageNotReceivedException exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException("메시지 전송 중 오류 발생: " + exception.getMessage());
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException("메시지 전송 중 오류 발생: " + exception.getMessage());
        }
    }

    // 인증 코드 검증
    @PostMapping("/verify-code")
    public boolean verifyCode(@RequestBody MessageRequest messageRequest, HttpSession session) {
        String storedCode = (String) session.getAttribute("verificationCode");
        System.out.println("세션에 저장된 코드: " + storedCode);
        System.out.println("입력된 코드: " + messageRequest.getText());
        return storedCode != null && storedCode.equals(messageRequest.getText());
    }

    // 무작위 6자리 숫자 생성
    private String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
