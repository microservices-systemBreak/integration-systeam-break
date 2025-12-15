package com.systembreak.sb_auth_service.infrastructure.adapter.output;

import com.systembreak.sb_auth_service.domain.model.TokenRevoked;
import com.systembreak.sb_auth_service.domain.port.output.TokenPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TokenPersistenceAdapter implements TokenPersistencePort {

    private final TokenRevokedRepository tokenRevokedRepository;

    @Override
    public void revokeToken(String token) {
        TokenRevoked revoked = new TokenRevoked();
        revoked.setToken(token);
        revoked.setRevokedAt(LocalDateTime.now());
        tokenRevokedRepository.save(revoked);
    }

    @Override
    public boolean isTokenRevoked(String token) {
        // Validación: refresh Token no debe estar en la tabla tokens_revoked.
        return tokenRevokedRepository.existsByToken(token);
    }
}