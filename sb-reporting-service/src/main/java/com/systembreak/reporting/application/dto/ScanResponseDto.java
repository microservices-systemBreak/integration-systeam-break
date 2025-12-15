package com.systembreak.reporting.application.dto;

import com.systembreak.reporting.domain.model.Scan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResponseDto {

    private Long id;

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

    public static ScanResponseDto fromDomain(Scan scan) {
        return ScanResponseDto.builder()
                .id(scan.getId())
                .correlationId(scan.getScanCorrelationId())
                .agentId(scan.getDevice().getAgentId())
                .hostname(scan.getDevice().getHostname())
                .ipAddress(scan.getDevice().getIpAddress())
                .operatingSystem(scan.getDevice().getOperatingSystem())
                .startedAt(scan.getStartedAt())
                .finishedAt(scan.getFinishedAt())
                .status(scan.getStatus())
                .overallSeverity(scan.getOverallSeverity())
                .totalPackages(scan.getTotalPackages())
                .vulnerablePackages(scan.getVulnerablePackages())
                .build();
    }
}
