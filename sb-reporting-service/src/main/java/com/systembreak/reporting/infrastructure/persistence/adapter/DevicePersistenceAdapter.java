package com.systembreak.reporting.infrastructure.persistence.adapter;

import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.ports.out.DevicePersistencePort;
import com.systembreak.reporting.infrastructure.persistence.entity.DeviceEntity;
import com.systembreak.reporting.infrastructure.persistence.repository.DeviceJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DevicePersistenceAdapter implements DevicePersistencePort {

    private final DeviceJpaRepository deviceJpaRepository;

    @Override
    public Optional<Device> findByAgentId(String agentId) {
        return deviceJpaRepository.findByAgentId(agentId)
                .map(this::toDomainModel);
    }

    @Override
    public Device save(Device device) {
        DeviceEntity entity = toEntity(device);
        DeviceEntity savedEntity = deviceJpaRepository.save(entity);
        return toDomainModel(savedEntity);
    }

    private Device toDomainModel(DeviceEntity entity) {
        return Device.builder()
                .id(entity.getId())
                .agentId(entity.getAgentId())
                .hostname(entity.getHostname())
                .ipAddress(entity.getIpAddress())
                .build();
    }

    private DeviceEntity toEntity(Device device) {
        return DeviceEntity.builder()
                .id(device.getId())
                .agentId(device.getAgentId())
                .hostname(device.getHostname())
                .ipAddress(device.getIpAddress())
                .build();
    }
}
