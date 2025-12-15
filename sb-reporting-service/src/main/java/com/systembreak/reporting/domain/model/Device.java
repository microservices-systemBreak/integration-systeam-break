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
public class Device {

    private Long id;

    private String agentId;

    private String hostname;
    private String ipAddress;
    private String operatingSystem;

    private Instant createdAt;
    private Instant updatedAt;
}
