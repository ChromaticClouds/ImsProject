package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.AuthRequest;
import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.repositories.AuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository repository;

    public AuthResponse authenticate(AuthRequest request) throws UserNotFoundException {
        User user = repository.findByEid(request.getEid())
            .orElseThrow(() -> new UserNotFoundException("일치하는 로그인 정보가 없습니다."));
        return new AuthResponse(user);
    }
}
