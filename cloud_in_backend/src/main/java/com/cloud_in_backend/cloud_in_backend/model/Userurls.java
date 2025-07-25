package com.cloud_in_backend.cloud_in_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor


public class Userurls {
    @Id
    private String id;

    private String email;

    private String[] urls;
}
