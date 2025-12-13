package com.systembreak.sb_auth_service.infrastructure.adapter.input.dto;

public record RefreshTokenRequest(
        String refreshToken // El refresh token a validar
) {}
