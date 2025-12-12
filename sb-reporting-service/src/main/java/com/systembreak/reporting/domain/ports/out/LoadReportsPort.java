package com.systembreak.reporting.domain.ports.out;

import com.systembreak.reporting.domain.model.Scan;

import java.util.List;
import java.util.Optional;

public interface LoadReportsPort {

    Optional<Scan> loadLatestScanForDevice(String agentId);

    List<Scan> loadScanHistoryForDevice(String agentId);
}
