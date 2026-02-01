package com.example.ims.features.auth.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.LoginRequest;
import com.example.ims.features.auth.dto.AuthResult;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.AuthError;
import com.example.ims.features.auth.exceptions.UnauthorizedException;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.jwt.JwtProvider;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.auth.stores.RefreshTokenStore;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;
    private final AuthRepository repository;
    private final RefreshTokenStore tokenStore;

    public AuthResult loginUser(LoginRequest request) throws UserNotFoundException {
        User user = repository.findByEid(request.getEid())
            .orElseThrow(() -> new UserNotFoundException(AuthError.USER_NOT_FOUND));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
        }

        String accessToken = jwtProvider.createAccessToken(
            user.getId(), 
            user.getEmail(), 
            user.getUserRole()
        );

        String refreshToken = 
        	jwtProvider.createRefreshToken(user.getId());

        tokenStore.save(refreshToken, user.getId());

        return new AuthResult(user, accessToken, refreshToken);
    }

    public AuthResult refresh(String refreshToken) {
        jwtProvider.validate(refreshToken);
        
        System.out.println(refreshToken);
        
        Long userId = tokenStore.findUserId(refreshToken)
        	.orElseThrow(UnauthorizedException::new);
        
        tokenStore.delete(refreshToken, userId);
        
        User user = repository.findById(userId)
        	.orElseThrow(UnauthorizedException::new);

        String newRefresh = 
        	jwtProvider.createRefreshToken(userId);
        
        tokenStore.save(newRefresh, userId); 
        
        String newAccess = jwtProvider.createAccessToken(
    		userId, 
    		user.getEmail(),
    		user.getUserRole()
        );
        
        return new AuthResult(user, newAccess, newRefresh);
    }
}
