package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.AuthRequest;
import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.repositories.AuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository repository;

    public AuthResponse authenticate(AuthRequest request) {
        User user = repository.findByEid(request.getEid()).orElseThrow();
        return new AuthResponse(user);
    }
}
