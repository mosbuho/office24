package com.kh.backend.common.message;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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

    private Map<String, MessageRequest> requestInfoMap = new HashMap<>();

    @Value("${coolsms.fromnumber}")
    private String fromNumber;

    public MessageController(
            @Value("${coolsms.apikey}") String apiKey,
            @Value("${coolsms.apisecret}") String apiSecret) {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }

    @PostMapping("/send-one")
    public ResponseEntity<String> sendOne(@RequestBody MessageRequest messageRequest, HttpSession session) {
        String phoneNumber = messageRequest.getTo();
        long currentTime = System.currentTimeMillis();

        MessageRequest requestInfo = requestInfoMap.getOrDefault(phoneNumber, new MessageRequest());
        requestInfo.setTo(phoneNumber);

        // 3분 이내에 3회 초과하는 요청을 하는 경우 제한 설정
        if (requestInfo.getCount() >= 3 && (currentTime - requestInfo.getLastRequestTime()) < 3 * 60 * 1000) {
            return ResponseEntity.status(429).body("요청 횟수를 초과하였습니다. 5분 후에 다시 시도하세요.");
        }
        
        if ((currentTime - requestInfo.getLastRequestTime()) >= 3 * 60 * 1000) {
            requestInfo.setCount(1);
        } else {
            requestInfo.setCount(requestInfo.getCount() + 1);
        }
        requestInfo.setLastRequestTime(currentTime);
        requestInfoMap.put(phoneNumber, requestInfo);

        String code = generateRandomCode();
        session.setAttribute("verificationCode", code);

        Message message = new Message();
        message.setFrom(fromNumber);
        message.setTo(phoneNumber);
        message.setText("[Office24] 인증코드 (" + code + ")를 입력해주세요");

        try {
            messageService.send(message);
            System.out.println("메시지 전송 성공");
            System.out.println("생성된 인증 코드: " + code);
            return ResponseEntity.ok("인증 코드가 전송되었습니다.");
        } catch (NurigoMessageNotReceivedException exception) {
            System.out.println(exception.getMessage());
            return ResponseEntity.status(500).body("메시지 전송 중 오류 발생: " + exception.getMessage());
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            return ResponseEntity.status(500).body("메시지 전송 중 오류 발생: " + exception.getMessage());
        }
    }

    @PostMapping("/verify-code")
    public boolean verifyCode(@RequestBody MessageRequest messageRequest, HttpSession session) {
        String storedCode = (String) session.getAttribute("verificationCode");
        System.out.println("세션에 저장된 코드: " + storedCode);
        System.out.println("입력된 코드: " + messageRequest.getText());
        return storedCode != null && storedCode.equals(messageRequest.getText());
    }

    private String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
