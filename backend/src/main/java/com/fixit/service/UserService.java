package com.fixit.service;

import com.fixit.dto.UserResponse;
import com.fixit.entity.User;
import com.fixit.exception.ApiException;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return UserResponse.fromEntity(user);
    }
}
