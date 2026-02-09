package com.example.ims.features.invitation.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class InvalidInvitationTokenException extends BusinessException {
    public InvalidInvitationTokenException() {
        super(InvitationError.INVALID_TOKEN);
    }
}
