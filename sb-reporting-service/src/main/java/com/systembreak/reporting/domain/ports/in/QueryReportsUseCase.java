package com.systembreak.reporting.domain.ports.in;

import com.systembreak.reporting.domain.model.Scan;

import java.util.List;
import java.util.Optional;

public interface QueryReportsUseCase {


    Optional<Scan> getLatestScanForDevice(String agentId);


    List<Scan> getScanHistoryForDevice(String agentId);
}
