package com.cloud_in_backend.cloud_in_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class hello {

    @GetMapping("hello")
    public String sayHello(){
        return("Hello Working Yay...");
    }
}
