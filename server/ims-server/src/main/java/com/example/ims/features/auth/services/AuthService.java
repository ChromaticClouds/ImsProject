package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.LoginRequest;
import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.dto.InviteVerifyResponse;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.AuthError;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.features.invitation.stores.InvitationTokenStore;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository repository;
    private final InvitationTokenStore tokenStore;

    public AuthResponse loginUser(LoginRequest request) throws UserNotFoundException {
        User user = repository.findByEid(request.getEid())
            .orElseThrow(() -> new UserNotFoundException(AuthError.USER_NOT_FOUND));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
        }
        
        return new AuthResponse(user);
    }

    public InviteVerifyResponse verifyInviteToken (String token) {
        String email = tokenStore.findEmailByToken(token)
            .orElseThrow(InvalidInvitationTokenException::new);

        System.out.println(email);

        User user = repository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException(AuthError.USER_NOT_FOUND));

        return new InviteVerifyResponse(
            user.getStatus(),
            user.getEmail()
        );
    }
}
