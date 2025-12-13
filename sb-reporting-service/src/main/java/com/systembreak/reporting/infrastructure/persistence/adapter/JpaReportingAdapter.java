package com.systembreak.reporting.infrastructure.persistence.adapter;

import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.out.LoadReportsPort;
import com.systembreak.reporting.domain.ports.out.SaveScanPort;
import com.systembreak.reporting.infrastructure.mapper.DomainMapper;
import com.systembreak.reporting.infrastructure.persistence.entity.DeviceEntity;
import com.systembreak.reporting.infrastructure.persistence.entity.ScanEntity;
import com.systembreak.reporting.infrastructure.persistence.repository.DeviceJpaRepository;
import com.systembreak.reporting.infrastructure.persistence.repository.ScanJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JpaReportingAdapter implements SaveScanPort, LoadReportsPort {

    private final DeviceJpaRepository deviceRepository;
    private final ScanJpaRepository scanRepository;
    private final DomainMapper mapper;

    @Override
    @Transactional
    public Scan saveScan(Scan scan) {
        Device device = scan.getDevice();


        DeviceEntity deviceEntity = deviceRepository.findByAgentId(device.getAgentId())
                .orElseGet(() -> deviceRepository.save(mapper.toEntity(device)));


        ScanEntity scanEntity = mapper.toEntity(scan, deviceEntity);
        ScanEntity saved = scanRepository.save(scanEntity);

        return mapper.toDomain(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Scan> loadLatestScanForDevice(String agentId) {
        ScanEntity latest = scanRepository.findFirstByDeviceAgentIdOrderByFinishedAtDesc(agentId);
        return Optional.ofNullable(latest).map(mapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Scan> loadScanHistoryForDevice(String agentId) {
        return scanRepository.findByDeviceAgentIdOrderByFinishedAtDesc(agentId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }
}
