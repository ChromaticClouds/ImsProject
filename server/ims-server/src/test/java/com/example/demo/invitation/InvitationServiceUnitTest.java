package com.example.demo.invitation;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.auth.repositories.AuthRepository;
import com.example.ims.features.invitation.dto.InvitationMailPayload;
import com.example.ims.features.invitation.services.InvitationService;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
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

    @Mock InvitationTokenStore tokenStore;
    @Mock AuthRepository repository;

    @InjectMocks InvitationService service;

    @Test
    @DisplayName("유저 있음 → 유저 저장 안 함 + 토큰 저장 + payload 반환")
    void createInvitation_should_not_save_user_when_exists() {
        String email = "b@test.com";
        User existing = new User();

        existing.setEmail(email);
        existing.setStatus(UserStatus.ACTIVE);
        existing.setUserRole(UserRole.PLACE_ORDER);

        when(repository.findByEmail(email)).thenReturn(Optional.of(existing));

        InvitationMailPayload payload = service.createInvitation(email);

        verify(tokenStore).save(anyString(), eq(email), eq(Duration.ofHours(24)));
        verify(repository, never()).save(any(User.class));

        assertSame(existing, payload.getUser());
        assertNotNull(payload.getToken());
    }
}
