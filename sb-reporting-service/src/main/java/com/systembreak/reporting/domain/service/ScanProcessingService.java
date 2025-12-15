package com.systembreak.reporting.domain.service;

import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.in.ProcessScanCompletedUseCase;
import com.systembreak.reporting.domain.ports.out.DevicePersistencePort;
import com.systembreak.reporting.domain.ports.out.ScanPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ScanProcessingService implements ProcessScanCompletedUseCase {

    private final DevicePersistencePort devicePersistencePort;
    private final ScanPersistencePort scanPersistencePort; // Necesitamos un método para guardar scans

    @Override
    public Scan processScanCompleted(String jobId, String endpointId, String correlationId, Instant completedAt, String overallSeverity, Integer vulnerabilitiesFound, Integer packagesAnalyzed) {
        // 1. Encontrar o crear el Device
        Device device = devicePersistencePort.findByAgentId(endpointId)
                .orElseGet(() -> {
                    // Si el dispositivo no existe, lo creamos.
                    // En un escenario real, quizás se debería registrar el dispositivo primero
                    // o el evento debería traer más información del dispositivo.
                    return devicePersistencePort.save(Device.builder()
                            .agentId(endpointId)
                            .hostname("unknown-hostname") // Placeholder
                            .ipAddress("unknown-ip")      // Placeholder
                            .build());
                });

        // 2. Crear el Scan
        Scan scan = Scan.builder()
                .device(device)
                .scanCorrelationId(jobId) // Usamos jobId como scanCorrelationId
                .startedAt(completedAt) // Asumimos que startedAt es similar a completedAt si no hay otro dato
                .finishedAt(completedAt)
                .status("COMPLETED") // El evento indica que el scan ya está completo
                .overallSeverity(overallSeverity)
                .totalPackages(packagesAnalyzed)
                .vulnerablePackages(vulnerabilitiesFound)
                .rawReport(null) // Este evento no trae el rawReport detallado
                .build();

        // 3. Guardar el Scan
        return scanPersistencePort.save(scan);
    }
}
