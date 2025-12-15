package com.systembreak.reporting.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanCompletedEventDto {

    private String correlationId;

    private String agentId;
    private String hostname;
    private String ipAddress;
    private String operatingSystem;

    private Instant startedAt;
    private Instant finishedAt;

    private String status;
    private String overallSeverity;

    private Integer totalPackages;
    private Integer vulnerablePackages;

    private String rawReport;
}
