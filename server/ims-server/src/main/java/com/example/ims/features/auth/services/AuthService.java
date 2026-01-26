package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.AuthRequest;
import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.AuthError;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.repositories.AuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository repository;

    public AuthResponse authenticate(AuthRequest request) throws UserNotFoundException {
        User user = repository.findByEid(request.getEid())
            .orElseThrow(() -> new UserNotFoundException(AuthError.USER_NOT_FOUND));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
        }
        
        return new AuthResponse(user);
    }
}
