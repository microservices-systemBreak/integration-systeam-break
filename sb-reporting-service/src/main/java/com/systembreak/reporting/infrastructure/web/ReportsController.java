package com.systembreak.reporting.infrastructure.web;

import com.systembreak.reporting.application.dto.ScanResponseDto;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.in.QueryScansUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final QueryScansUseCase queryScansUseCase;

    @GetMapping("/devices/{deviceId}/packages/latest")
    public ResponseEntity<ScanResponseDto> getLatestScan(@PathVariable String deviceId) {
        return queryScansUseCase.getLatestScanForDevice(deviceId)
                .map(ScanResponseDto::fromDomain)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/devices/{deviceId}/packages/history")
    public ResponseEntity<List<ScanResponseDto>> getScanHistory(@PathVariable String deviceId) {
        List<Scan> scans = queryScansUseCase.getScanHistoryForDevice(deviceId);
        List<ScanResponseDto> response = scans.stream()
                .map(ScanResponseDto::fromDomain)
                .toList();
        return ResponseEntity.ok(response);
    }
}
