package com.systembreak.reporting.domain.ports.in;

import com.systembreak.reporting.domain.model.Scan;

import java.util.List;
import java.util.Optional;

public interface QueryScansUseCase {
    Optional<Scan> getLatestScanForDevice(String deviceId);
    List<Scan> getScanHistoryForDevice(String deviceId);
}
