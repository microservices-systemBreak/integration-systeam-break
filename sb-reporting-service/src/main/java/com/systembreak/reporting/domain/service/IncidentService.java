package com.systembreak.reporting.domain.service;

import com.systembreak.reporting.domain.model.Incident;
import com.systembreak.reporting.domain.ports.in.QueryIncidentsUseCase;
import com.systembreak.reporting.domain.ports.out.IncidentPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService implements QueryIncidentsUseCase {

    private final IncidentPersistencePort incidentPersistencePort;

    @Override
    public List<Incident> getAllIncidents() {
        return incidentPersistencePort.findAll();
    }
}
