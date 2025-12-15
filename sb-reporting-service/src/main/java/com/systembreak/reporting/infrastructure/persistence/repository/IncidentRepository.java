package com.systembreak.reporting.infrastructure.persistence.repository;

import com.systembreak.reporting.infrastructure.persistence.entity.IncidentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<IncidentEntity, Long> {
}
