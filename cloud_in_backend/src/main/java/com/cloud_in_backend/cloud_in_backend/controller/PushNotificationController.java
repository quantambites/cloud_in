package com.cloud_in_backend.cloud_in_backend.controller;

import com.cloud_in_backend.cloud_in_backend.model.PushNotificationRequest;
import com.cloud_in_backend.cloud_in_backend.service.PushNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/urls/push")
public class PushNotificationController {

    @Autowired
    private PushNotificationService pushNotificationService;

    @PostMapping("/send")
    public String sendPushNotification(@RequestBody PushNotificationRequest request) {
        return pushNotificationService.sendNotification(request);
    }
}