package com.systembreak.reporting.infrastructure.web;

import com.systembreak.reporting.application.dto.IncidentResponseDto;
import com.systembreak.reporting.domain.ports.in.QueryIncidentsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class IncidentsController {

    private final QueryIncidentsUseCase queryIncidentsUseCase;

    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentResponseDto>> getIncidents() {

        List<IncidentResponseDto> incidents = queryIncidentsUseCase.getAllIncidents()
                .stream()
                .map(incident -> IncidentResponseDto.builder()
                        .id(incident.getId())
                        .deviceAgentId(incident.getDevice().getAgentId())
                        .type(incident.getType())
                        .description(incident.getDescription())
                        .detectedAt(incident.getDetectedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(incidents);
    }
}
