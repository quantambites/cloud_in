package com.cloud_in_backend.cloud_in_backend.service;

import com.cloud_in_backend.cloud_in_backend.model.PushNotificationRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PushNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final RestTemplate restTemplate;

    public PushNotificationService() {
        this.restTemplate = new RestTemplate();
    }

    public String sendNotification(PushNotificationRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(MediaType.parseMediaTypes("application/json"));
        headers.set("Accept-Encoding", "gzip, deflate");

        Map<String, Object> payload = Map.of(
                "to", request.getTo(),
                "title", request.getTitle(),
                "body", request.getBody(),
                "sound", "default"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(EXPO_PUSH_URL, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "Push notification failed: " + e.getMessage();
        }
    }
}