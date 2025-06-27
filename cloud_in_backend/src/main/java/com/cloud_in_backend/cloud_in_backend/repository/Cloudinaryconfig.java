package com.cloud_in_backend.cloud_in_backend.repository;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Cloudinaryconfig {

    @Bean
    public Cloudinary cloudinary(){
        return new Cloudinary(ObjectUtils.asMap(

                "cloud_name","d********",
                "api_key","************",
                "api_secret","**********"
        ));
    }
}
