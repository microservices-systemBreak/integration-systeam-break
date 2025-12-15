package com.systembreak.reporting.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ActionResponseDto {
    private Long id;
    private String type;
    private String parameters;
    private String status;
    private Instant executedAt;
}
