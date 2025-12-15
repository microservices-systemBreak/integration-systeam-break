package com.systembreak.sb_auth_service.infrastructure.adapter.input.dto;

import java.util.List;
import java.util.UUID;

// Used in LoginResponse and MeResponse
public record UserResponse(
        UUID id, // Identificador único del usuario [22]
        String username, // Nombre de usuario [23]
        List<String> roles, // Roles asignados [24]
        List<String> permissions // Permisos derivados de los roles [60]
) {}