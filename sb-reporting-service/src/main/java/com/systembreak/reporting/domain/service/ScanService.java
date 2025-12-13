package com.systembreak.reporting.domain.service;

import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.in.QueryScansUseCase;
import com.systembreak.reporting.domain.ports.out.ScanPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScanService implements QueryScansUseCase {

    private final ScanPersistencePort scanPersistencePort;

    @Override
    public Optional<Scan> getLatestScanForDevice(String deviceId) {
        return scanPersistencePort.findLatestForDevice(deviceId);
    }

    @Override
    public List<Scan> getScanHistoryForDevice(String deviceId) {
        return scanPersistencePort.findHistoryForDevice(deviceId);
    }
}
