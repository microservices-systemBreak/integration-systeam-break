package com.systembreak.reporting.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanCompletedEvent {
    private String eventType;
    private String jobId;
    private String endpointId;
    private String correlationId;
    private Instant completedAt;
    private ScanResult result;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScanResult {
        private String overallSeverity;
        private Integer vulnerabilitiesFound;
        private Integer packagesAnalyzed;
    }
}
