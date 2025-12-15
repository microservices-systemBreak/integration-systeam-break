package com.systembreak.reporting.domain.ports.out;

import com.systembreak.reporting.domain.model.Scan;

import java.util.List;
import java.util.Optional;

public interface ScanPersistencePort {
    Optional<Scan> findLatestForDevice(String deviceId);
    List<Scan> findHistoryForDevice(String deviceId);
    Scan save(Scan scan); // Añadido el método save
}
