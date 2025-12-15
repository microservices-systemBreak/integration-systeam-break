package com.systembreak.reporting.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "actions")
@Getter
@Setter
public class ActionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String parameters;
    private String status;

    @Column(name = "executed_at")
    private Instant executedAt;
}
