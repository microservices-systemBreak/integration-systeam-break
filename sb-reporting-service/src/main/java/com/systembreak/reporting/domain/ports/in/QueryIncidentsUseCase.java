package com.systembreak.reporting.domain.ports.in;

import com.systembreak.reporting.domain.model.Incident;

import java.util.List;

public interface QueryIncidentsUseCase {
    List<Incident> getAllIncidents();
}
