package com.cloud_in_backend.cloud_in_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushNotificationRequest {
    private String to;
    private String title;
    private String body;
}