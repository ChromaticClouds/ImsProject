package com.example.ims.features.user.services;

import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.user.dto.UpdateUserRequest;
import com.example.ims.features.user.dto.UserListResponse;
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

        if (request.rank() != null) user.changeRank(request.rank());
        if (request.role() != null) user.changeRole(request.role());
        if (request.status() != null) user.setStatus(request.status());
    }
}
