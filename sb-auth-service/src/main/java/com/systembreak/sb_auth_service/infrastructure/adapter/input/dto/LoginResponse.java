package com.systembreak.sb_auth_service.infrastructure.adapter.input.dto;

// Response: { accessToken, refreshToken, user: { id, username, roles } }
public record LoginResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}