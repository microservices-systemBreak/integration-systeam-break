package com.systembreak.reporting.infrastructure.persistence.repository;

import com.systembreak.reporting.infrastructure.persistence.entity.DeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceJpaRepository extends JpaRepository<DeviceEntity, Long> {

    Optional<DeviceEntity> findByAgentId(String agentId);
}
