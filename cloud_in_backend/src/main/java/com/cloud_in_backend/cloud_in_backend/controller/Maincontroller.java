package com.cloud_in_backend.cloud_in_backend.controller;

import com.cloud_in_backend.cloud_in_backend.model.Userurls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cloud_in_backend.cloud_in_backend.repository.Userrepo;


import java.util.*;

@RestController
public class Maincontroller {

    @Autowired
    Userrepo userrepo;

    @PostMapping("/api/urls/add")
    public Userurls addUrl(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String newUrl = payload.get("url");

        Optional<Userurls> optionalUser = userrepo.findByEmail(email);
        Userurls user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            List<String> urlList = new ArrayList<>(Arrays.asList(user.getUrls()));
            urlList.add(newUrl);
            user.setUrls(urlList.toArray(new String[0]));
        } else {
            user = new Userurls();
            user.setEmail(email);
            user.setUrls(new String[]{newUrl});
        }

        return userrepo.save(user);
    }

    @GetMapping("/api/urls/{email}")
    public Userurls geturl(@PathVariable String email){
        return userrepo.findByEmail(email).orElse(null);
    }

    @DeleteMapping("/api/urls/delete")
    public ResponseEntity<Map<String, Object>> deleteUrl(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String urlToDelete = payload.get("url");

        Optional<Userurls> optionalUser = userrepo.findByEmail(email);

        if (optionalUser.isPresent()) {
            Userurls user = optionalUser.get();
            List<String> urlList = new ArrayList<>(Arrays.asList(user.getUrls()));

            boolean removed = urlList.removeIf(url -> url.equals(urlToDelete));

            if (!removed) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "error", "URL not found in user's list"
                ));
            }

            user.setUrls(urlList.toArray(new String[0]));
            userrepo.save(user);

            return ResponseEntity.ok(Map.of("user", user));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "User not found"
        ));
    }

}
