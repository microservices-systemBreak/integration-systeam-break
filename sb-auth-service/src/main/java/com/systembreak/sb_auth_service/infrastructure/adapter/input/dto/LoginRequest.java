package com.systembreak.sb_auth_service.infrastructure.adapter.input.dto;

import lombok.Builder;

// Request body esperado: { "username": "string", "password": "string" }
@Builder
public record LoginRequest(
        String username,
        String password
) {}
