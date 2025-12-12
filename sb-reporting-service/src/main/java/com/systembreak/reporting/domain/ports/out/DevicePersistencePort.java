package com.systembreak.reporting.domain.ports.out;

import com.systembreak.reporting.domain.model.Device;

import java.util.Optional;

public interface DevicePersistencePort {
    Optional<Device> findByAgentId(String agentId);
    Device save(Device device);
}
