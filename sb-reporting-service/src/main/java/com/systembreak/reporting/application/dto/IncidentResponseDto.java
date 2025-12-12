package com.systembreak.reporting.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class IncidentResponseDto {
    private Long id;
    private String deviceAgentId;
    private String type;
    private String description;
    private Instant detectedAt;
}
