package com.example.ims.features.invitation.services;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.invitation.dto.SoloEmailRequest;
import org.springframework.stereotype.Service;

import com.example.ims.features.auth.dto.InviteVerifyResponse;
import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.invitation.dto.EmailRequest;
import com.example.ims.features.invitation.dto.InvitationMailPayload;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
import com.resend.core.exception.ResendException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private static final Duration INVITE_TTL 
        = Duration.ofHours(24);

    private final InvitationTokenStore tokenStore;
    private final InvitationMailSender mailSender;
    private final AuthRepository repository;

    public void invite(EmailRequest request) throws ResendException {
        List<InvitationMailPayload> invitedUsers = request.getEmails().stream()
            .map(this::createInvitation)
            .toList();

        System.out.println(invitedUsers);

        mailSender.sendBatch(invitedUsers);
    }

    public void inviteSingle(SoloEmailRequest request) throws ResendException {
        InvitationMailPayload invitedSingle = createInvitation(request.getEmail());
        mailSender.sendOne(invitedSingle);
    }

    public InvitationMailPayload createInvitation(String email) {
        String token = UUID.randomUUID().toString();
        tokenStore.save(token, email, INVITE_TTL);

        User found = repository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setStatus(UserStatus.PENDING);
            user.setUserRole(UserRole.NONE);
            repository.save(user);
            return user;
        });

        return new InvitationMailPayload(found, token);
    }

    public InviteVerifyResponse verifyInviteToken (String token) {
        String email = tokenStore.findEmailByToken(token)
            .orElseThrow(InvalidInvitationTokenException::new);

        User user = repository.findByEmail(email)
            .orElseThrow(UserNotFoundException::new);

        return new InviteVerifyResponse(
            user.getStatus(),
            user.getEmail()
        );
    }
}
