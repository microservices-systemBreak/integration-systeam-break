package com.systembreak.reporting.infrastructure.web;

import com.systembreak.reporting.application.dto.ScanCompletedEvent; // Usar el DTO del evento de RabbitMQ
import com.systembreak.reporting.application.dto.ScanResponseDto;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.in.ProcessScanCompletedUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventsController {

    private final ProcessScanCompletedUseCase processScanCompletedUseCase;

    @PostMapping("/scan-completed")
    public ResponseEntity<ScanResponseDto> handleScanCompleted(
            @RequestBody ScanCompletedEvent event) { // Recibir el DTO del evento

        // Llamar al caso de uso con los parámetros individuales
        Scan saved = processScanCompletedUseCase.processScanCompleted(
                event.getJobId(),
                event.getEndpointId(),
                event.getCorrelationId(),
                event.getCompletedAt(),
                event.getResult().getOverallSeverity(),
                event.getResult().getVulnerabilitiesFound(),
                event.getResult().getPackagesAnalyzed()
        );

        return ResponseEntity.ok(ScanResponseDto.fromDomain(saved));
    }
}
