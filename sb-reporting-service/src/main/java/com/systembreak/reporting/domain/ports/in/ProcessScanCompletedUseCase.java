package com.systembreak.reporting.domain.ports.in;

import com.systembreak.reporting.domain.model.Scan;

import java.time.Instant; // Importar Instant

public interface ProcessScanCompletedUseCase {
    Scan processScanCompleted(String jobId, String endpointId, String correlationId, Instant completedAt, String overallSeverity, Integer vulnerabilitiesFound, Integer packagesAnalyzed);
}
