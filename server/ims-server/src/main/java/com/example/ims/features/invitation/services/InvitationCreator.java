package com.example.ims.features.invitation.services;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.invitation.dto.EmailRequest;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
import com.resend.core.exception.ResendException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationCreator {

    private static final Duration INVITE_TTL 
        = Duration.ofMinutes(5);

    private final InvitationTokenStore tokenStore;
    private final InvitationMailSender mailSender;
    private final AuthRepository repository;

    public void invite(EmailRequest request) throws ResendException {
        List<User> invitedUsers = request.getEmails().stream()
            .map(this::createInvitation)
            .toList();

        mailSender.createInvitation(invitedUsers);
    }

    public User createInvitation(String email) {
        String token = UUID.randomUUID().toString();
        tokenStore.save(token, email, INVITE_TTL);

        return repository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            return user;
        });
    }
}
