package com.systembreak.reporting.infrastructure.mapper;

import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.infrastructure.persistence.entity.DeviceEntity;
import com.systembreak.reporting.infrastructure.persistence.entity.ScanEntity;
import org.springframework.stereotype.Component;

@Component
public class DomainMapper {

    public DeviceEntity toEntity(Device device) {
        if (device == null) return null;

        return DeviceEntity.builder()
                .id(device.getId())
                .agentId(device.getAgentId())
                .hostname(device.getHostname())
                .ipAddress(device.getIpAddress())
                .operatingSystem(device.getOperatingSystem())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }

    public Device toDomain(DeviceEntity entity) {
        if (entity == null) return null;

        return Device.builder()
                .id(entity.getId())
                .agentId(entity.getAgentId())
                .hostname(entity.getHostname())
                .ipAddress(entity.getIpAddress())
                .operatingSystem(entity.getOperatingSystem())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public ScanEntity toEntity(Scan scan, DeviceEntity deviceEntity) {
        if (scan == null) return null;

        return ScanEntity.builder()
                .id(scan.getId())
                .device(deviceEntity)
                .scanCorrelationId(scan.getScanCorrelationId())
                .startedAt(scan.getStartedAt())
                .finishedAt(scan.getFinishedAt())
                .status(scan.getStatus())
                .overallSeverity(scan.getOverallSeverity())
                .totalPackages(scan.getTotalPackages())
                .vulnerablePackages(scan.getVulnerablePackages())
                .rawReport(scan.getRawReport())
                .build();
    }

    public Scan toDomain(ScanEntity entity) {
        if (entity == null) return null;

        return Scan.builder()
                .id(entity.getId())
                .device(toDomain(entity.getDevice()))
                .scanCorrelationId(entity.getScanCorrelationId())
                .startedAt(entity.getStartedAt())
                .finishedAt(entity.getFinishedAt())
                .status(entity.getStatus())
                .overallSeverity(entity.getOverallSeverity())
                .totalPackages(entity.getTotalPackages())
                .vulnerablePackages(entity.getVulnerablePackages())
                .rawReport(entity.getRawReport())
                .build();
    }
}
