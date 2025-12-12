package com.systembreak.reporting.infrastructure.persistence.adapter;

import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.out.ScanPersistencePort;
import com.systembreak.reporting.infrastructure.persistence.entity.DeviceEntity;
import com.systembreak.reporting.infrastructure.persistence.entity.ScanEntity;
import com.systembreak.reporting.infrastructure.persistence.repository.ScanJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ScanPersistenceAdapter implements ScanPersistencePort {

    private final ScanJpaRepository scanJpaRepository;
    // Mapper a implementar
    
    @Override
    public Optional<Scan> findLatestForDevice(String deviceId) {
        return Optional.ofNullable(scanJpaRepository.findFirstByDeviceAgentIdOrderByFinishedAtDesc(deviceId))
                .map(this::toDomainModel);
    }

    @Override
    public List<Scan> findHistoryForDevice(String deviceId) {
        return scanJpaRepository.findByDeviceAgentIdOrderByFinishedAtDesc(deviceId).stream()
                .map(this::toDomainModel)
                .collect(Collectors.toList());
    }

    @Override
    public Scan save(Scan scan) {
        ScanEntity entity = toEntity(scan);
        ScanEntity savedEntity = scanJpaRepository.save(entity);
        return toDomainModel(savedEntity);
    }

    private Scan toDomainModel(ScanEntity entity) {
        // Conversión simplificada
        Device device = Device.builder()
                .id(entity.getDevice().getId())
                .agentId(entity.getDevice().getAgentId())
                .hostname(entity.getDevice().getHostname())
                .ipAddress(entity.getDevice().getIpAddress())
                .build();

        return Scan.builder()
                .id(entity.getId())
                .device(device)
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

    private ScanEntity toEntity(Scan scan) {
        DeviceEntity deviceEntity = DeviceEntity.builder()
                .id(scan.getDevice().getId())
                .agentId(scan.getDevice().getAgentId())
                .hostname(scan.getDevice().getHostname())
                .ipAddress(scan.getDevice().getIpAddress())
                .build();

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
}
