package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ims.features.auth.dto.LoginRequest;
import com.example.ims.features.auth.dto.PasswordRequest;
import com.example.ims.features.auth.dto.RegisterRequest;
import com.example.ims.features.auth.dto.AuthResult;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.UnauthorizedException;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.auth.stores.RefreshTokenStore;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
import com.example.ims.security.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;
    private final AuthRepository repository;
    private final RefreshTokenStore refreshTokenStore;
    private final InvitationTokenStore invitationTokenStore;

    public AuthResult loginUser(LoginRequest request) throws UserNotFoundException {
        User user = repository.findByEid(request.getEid())
            .orElseThrow(UserNotFoundException::new);
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UserNotFoundException();
        }

        String accessToken = jwtProvider.createAccessToken(
            user.getId(), 
            user.getEmail(),
            user.getUserRank(),
            user.getUserRole()
        );

        String refreshToken = 
        	jwtProvider.createRefreshToken(user.getId());

        refreshTokenStore.save(refreshToken, user.getId());

        return new AuthResult(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResult registerUser(RegisterRequest request) {
        String email = invitationTokenStore
            .findEmailByToken(request.getToken())
            .orElseThrow(InvalidInvitationTokenException::new);

        User user = repository.findByEmail(email)
            .orElseThrow(UserNotFoundException::new)
            .register(request.getName(), request.getPassword());

        String accessToken = jwtProvider.createAccessToken(
            user.getId(), 
            user.getEmail(),
            user.getUserRank(),
            user.getUserRole()
        );

        String refreshToken = 
        	jwtProvider.createRefreshToken(user.getId());

        invitationTokenStore.delete(request.getToken());

        return new AuthResult(user, accessToken, refreshToken);
    }

    public AuthResult refresh(String refreshToken) {
        jwtProvider.validate(refreshToken);
        
        Long userId = refreshTokenStore.findUserId(refreshToken)
        	.orElseThrow(UnauthorizedException::new);
        
        refreshTokenStore.delete(refreshToken, userId);
        
        User user = repository.findById(userId)
        	.orElseThrow(UnauthorizedException::new);

        String newRefresh = 
        	jwtProvider.createRefreshToken(userId);
        
        refreshTokenStore.save(newRefresh, userId); 
        
        String newAccess = jwtProvider.createAccessToken(
    		userId, 
    		user.getEmail(),
            user.getUserRank(),
    		user.getUserRole()
        );
        
        return new AuthResult(user, newAccess, newRefresh);
    }
}
