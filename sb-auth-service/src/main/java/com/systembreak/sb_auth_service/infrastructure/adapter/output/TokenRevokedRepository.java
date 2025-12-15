package com.systembreak.sb_auth_service.infrastructure.adapter.output;

import com.systembreak.sb_auth_service.domain.model.TokenRevoked;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TokenRevokedRepository extends JpaRepository<TokenRevoked, UUID> {
    // Used to check if a token has been revoked [cite: 45, 73]
    boolean existsByToken(String token);
}