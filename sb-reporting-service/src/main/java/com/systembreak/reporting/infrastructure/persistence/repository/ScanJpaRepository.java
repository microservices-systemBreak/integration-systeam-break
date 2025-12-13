package com.systembreak.reporting.infrastructure.persistence.repository;

import com.systembreak.reporting.infrastructure.persistence.entity.ScanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScanJpaRepository extends JpaRepository<ScanEntity, Long> {

    List<ScanEntity> findByDeviceAgentIdOrderByFinishedAtDesc(String agentId);

    ScanEntity findFirstByDeviceAgentIdOrderByFinishedAtDesc(String agentId);
}
