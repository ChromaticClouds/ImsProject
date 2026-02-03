package com.example.ims.features.user.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.global.dto.PageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository repository;

    public PageResponse<User> getUserList(Pageable pageable) {
        Page<User> users = repository.findAll(pageable);
        return PageResponse.from(users);
    }
}
