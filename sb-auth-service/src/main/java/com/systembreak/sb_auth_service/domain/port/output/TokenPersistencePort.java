package com.systembreak.sb_auth_service.domain.port.output;

import com.systembreak.sb_auth_service.domain.model.TokenRevoked;

// Puerto para interactuar con la tabla tokens_revoked
public interface TokenPersistencePort {

    // Función: Revocar el refresh Token recibido, agregándolo a la tabla tokens_revoked.
    void revokeToken(String token);

    // Validación: refresh Token no debe estar en la tabla tokens_revoked.
    boolean isTokenRevoked(String token);
}