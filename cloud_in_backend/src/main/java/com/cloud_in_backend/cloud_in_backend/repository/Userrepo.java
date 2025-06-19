package com.cloud_in_backend.cloud_in_backend.repository;

import com.cloud_in_backend.cloud_in_backend.model.Userurls;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface Userrepo extends MongoRepository<Userurls, String> {

    Optional<Userurls> findByEmail(String email);
}
