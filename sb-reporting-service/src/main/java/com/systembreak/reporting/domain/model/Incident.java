package com.systembreak.reporting.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class Incident {
    private Long id;
    private Device device;
    private String type;
    private String description;
    private Instant detectedAt;
}
