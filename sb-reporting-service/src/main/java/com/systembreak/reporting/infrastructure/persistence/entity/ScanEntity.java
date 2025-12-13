package com.systembreak.reporting.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "scans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private DeviceEntity device;

    @Column(name = "scan_correlation_id", nullable = false)
    private String scanCorrelationId;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    private String status;

    @Column(name = "overall_severity")
    private String overallSeverity;

    @Column(name = "total_packages")
    private Integer totalPackages;

    @Column(name = "vulnerable_packages")
    private Integer vulnerablePackages;

    @Lob
    @Column(name = "raw_report", columnDefinition = "TEXT")
    private String rawReport;
}
