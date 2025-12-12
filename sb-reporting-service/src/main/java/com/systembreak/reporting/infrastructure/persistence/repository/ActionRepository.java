package com.systembreak.reporting.infrastructure.persistence.repository;

import com.systembreak.reporting.infrastructure.persistence.entity.ActionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionRepository extends JpaRepository<ActionEntity, Long> {
}
