package com.systembreak.reporting.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scan {

    private Long id;

    private Device device;


    private String scanCorrelationId;

    private Instant startedAt;
    private Instant finishedAt;


    private String status;


    private String overallSeverity;

    private Integer totalPackages;
    private Integer vulnerablePackages;


    private String rawReport;
}
