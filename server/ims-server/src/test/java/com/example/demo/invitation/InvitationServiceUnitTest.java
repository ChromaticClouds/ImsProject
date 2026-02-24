package com.example.demo.invitation;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.invitation.dto.InvitationMailPayload;
import com.example.ims.features.invitation.services.InvitationMailSender;
import com.example.ims.features.invitation.services.InvitationService;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
import com.example.ims.features.user.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class InvitationServiceUnitTest {

    private static final Duration INVITE_TTL
        = Duration.ofHours(24);

    @Mock InvitationTokenStore tokenStore;
    @Mock InvitationMailSender mailSender;
    @Mock UserRepository repository;

    @InjectMocks InvitationService service;

    @Test
    @DisplayName("유저 없음 → 유저 생성 + 저장 + 토큰 저장 + payload 반환")
    void createInvitation_should_create_user_when_not_exists() {

        String email = "a@test.com";
        when(repository.findByEmail(email)).thenReturn(Optional.empty());
        when(repository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        InvitationMailPayload payload = service.createInvitation(email);

        verify(tokenStore).save(anyString(), eq(email), eq(Duration.ofHours(24)));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(repository).save(captor.capture());

        User saved = captor.getValue();
        assertEquals(email, saved.getEmail());
        assertEquals(UserStatus.PENDING, saved.getStatus());
        assertEquals(UserRole.NONE, saved.getUserRole());

        assertNotNull(payload);
        assertEquals(email, payload.getUser().getEmail());
        assertNotNull(payload.getToken());
    }
}
