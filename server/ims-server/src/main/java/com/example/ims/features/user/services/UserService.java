package com.example.ims.features.user.services;

import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.stores.RefreshTokenStore;
import com.example.ims.features.user.dto.EmailRequest;
import com.example.ims.features.user.dto.PasswordChangeRequest;
import com.example.ims.features.user.dto.UpdateUserRequest;
import com.example.ims.features.user.dto.UserListResponse;
import com.example.ims.features.user.exceptions.InvalidPasswordException;
import com.example.ims.features.user.exceptions.PasswordMismatchException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.global.dto.PageResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository repository;
    private final RefreshTokenStore refreshTokenStore;

    private String normalize(String search) {
        return (search == null) ? "" : search.trim();
    }

    public PageResponse<UserListResponse> getUserList(Pageable pageable, String search) {
        List<UserStatus> excluded =
            List.of(UserStatus.DELETED, UserStatus.INACTIVE);

        Page<User> users =
            repository.findByStatusNotInAndNameContainingIgnoreCase(
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

    public void sendEmail(EmailRequest request) {

    }
}
