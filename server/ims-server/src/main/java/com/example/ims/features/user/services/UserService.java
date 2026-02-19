package com.example.ims.features.user.services;

import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.stores.RefreshTokenStore;
import com.example.ims.features.user.dto.*;
import com.example.ims.features.user.exceptions.InvalidPasswordException;
import com.example.ims.features.user.exceptions.InvalidTokenException;
import com.example.ims.features.user.exceptions.PasswordMismatchException;
import com.example.ims.features.user.stores.PasswordResetTokenStore;
import com.resend.core.exception.ResendException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.global.dto.PageResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Duration PASSWORD_CHANGE_TTL = Duration.ofHours(24);
    
    private final UserRepository repository;
    private final RefreshTokenStore refreshTokenStore;
    private final PasswordResetTokenStore passwordResetTokenStore;
    private final PasswordMailSender mailSender;

    private String normalize(String search) {
        return (search == null) ? "" : search.trim();
    }

    public PageResponse<UserListResponse> getUserList(Pageable pageable, String search) {
        List<UserStatus> excluded =
            List.of(UserStatus.DELETED, UserStatus.INACTIVE);

        Page<User> users =
            repository.findUsers(
                excluded,
                normalize(search),
                pageable
            );

        return PageResponse.from(users.map(UserListResponse::from));
    }

    public PageResponse<UserListResponse> getUserGroupList(Pageable pageable, String search) {
        List<UserStatus> excluded =
            List.of(UserStatus.DELETED, UserStatus.INACTIVE, UserStatus.PENDING);

        Page<User> users =
            repository.findUsers(
                excluded,
                normalize(search),
                pageable
            );

        return PageResponse.from(users.map(UserListResponse::from));
    }

    @Transactional
    public void updateUser(Long id, UpdateUserRequest request) {
        User user = repository.findById(id)
            .orElseThrow(UserNotFoundException::new);

        if (request.name() != null) user.setName(request.name());
        if (request.rank() != null) user.changeRank(request.rank());
        if (request.role() != null) user.changeRole(request.role());
        if (request.status() != null) user.setStatus(request.status());
    }

    public void changePassword(Long userId, PasswordChangeRequest request) {
        User user = repository.findById(userId)
            .orElseThrow(UserNotFoundException::new);

        if (!user.getPassword().equals(request.currentPassword()))
            throw new InvalidPasswordException();

        if (!request.newPassword().equals(request.confirmPassword()))
            throw new PasswordMismatchException();

        user.changePassword(request.newPassword());
        repository.save(user);
    }

    public void logoutUser(Long userId) {
        refreshTokenStore.deleteAll(userId);
    }

    public void sendEmail(EmailRequest request)
            throws ResendException {
        String token = UUID.randomUUID().toString();

        PasswordChangePayload payload =
            new PasswordChangePayload(request.email(), token);

        passwordResetTokenStore.save(payload, PASSWORD_CHANGE_TTL);

        User found = repository.findByEmail(payload.email())
            .orElse(null);

        if (found != null) {
            mailSender.createPasswordChangeForm(payload);
        }
    }

    public void verifyUserByToken(String token) {
        String email = passwordResetTokenStore
            .findEmailByToken(token)
            .orElseThrow(InvalidTokenException::new);

        repository.findByEmail(email)
            .orElseThrow(UserNotFoundException::new);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        if (!request.confirmPassword().equals(request.newPassword()))
            throw new PasswordMismatchException();

        String email = passwordResetTokenStore
            .findEmailByToken(request.token())
            .orElseThrow(InvalidTokenException::new);

        User user = repository.findByEmail(email)
            .orElseThrow(UserNotFoundException::new);

        passwordResetTokenStore.delete(request.token());

        user.changePassword(request.newPassword());
    }
}
