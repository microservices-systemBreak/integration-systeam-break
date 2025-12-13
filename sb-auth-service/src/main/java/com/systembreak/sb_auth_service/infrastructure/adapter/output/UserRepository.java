package com.systembreak.sb_auth_service.infrastructure.adapter.output;

import com.systembreak.sb_auth_service.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

// This acts as the JPA Adapter for the UserPersistencePort (our Output Port)
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username); // Used for login [cite: 16]
}
