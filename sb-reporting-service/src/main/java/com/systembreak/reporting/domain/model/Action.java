package com.systembreak.reporting.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class Action {
    private Long id;
    private String type;
    private String parameters;
    private String status;
    private Instant executedAt;
}
