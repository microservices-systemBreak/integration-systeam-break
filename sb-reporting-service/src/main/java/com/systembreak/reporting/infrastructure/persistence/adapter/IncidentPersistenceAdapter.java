package com.systembreak.reporting.infrastructure.persistence.adapter;

import com.systembreak.reporting.domain.model.Incident;
import com.systembreak.reporting.domain.ports.out.IncidentPersistencePort;
import com.systembreak.reporting.infrastructure.persistence.entity.IncidentEntity;
import com.systembreak.reporting.infrastructure.persistence.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class IncidentPersistenceAdapter implements IncidentPersistencePort {

    private final IncidentRepository incidentRepository;


    @Override
    public List<Incident> findAll() {
        return incidentRepository.findAll().stream()
                .map(this::toDomainModel)
                .collect(Collectors.toList());
    }

    private Incident toDomainModel(IncidentEntity entity) {

        return Incident.builder()
                .id(entity.getId())
                .type(entity.getType())
                .description(entity.getDescription())
                .detectedAt(entity.getDetectedAt())
                .build();
    }
}
