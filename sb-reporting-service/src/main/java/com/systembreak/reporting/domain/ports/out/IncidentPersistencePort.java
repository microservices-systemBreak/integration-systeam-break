package com.systembreak.reporting.domain.ports.out;

import com.systembreak.reporting.domain.model.Incident;

import java.util.List;

public interface IncidentPersistencePort {
    List<Incident> findAll();
}
