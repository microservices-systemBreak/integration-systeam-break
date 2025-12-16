package com.systembreak.reporting.infrastructure.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.systembreak.reporting.domain.model.Device;
import com.systembreak.reporting.domain.model.Scan;
import com.systembreak.reporting.domain.ports.in.QueryScansUseCase;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ReportsController.class)
public class ReportsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QueryScansUseCase queryScansUseCase;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getLatestScan_whenNotFound_returns404() throws Exception {
        Mockito.when(queryScansUseCase.getLatestScanForDevice(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/reports/devices/any-agent/packages/latest")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLatestScan_whenFound_returns200AndBody() throws Exception {
        Device device = Device.builder()
                .agentId("agent-1")
                .hostname("host")
                .ipAddress("127.0.0.1")
                .operatingSystem("linux")
                .build();

        Scan scan = Scan.builder()
                .id(1L)
                .device(device)
                .scanCorrelationId("corr-1")
                .startedAt(Instant.now())
                .finishedAt(Instant.now())
                .status("COMPLETED")
                .overallSeverity("MEDIUM")
                .totalPackages(10)
                .vulnerablePackages(2)
                .build();

        Mockito.when(queryScansUseCase.getLatestScanForDevice(anyString())).thenReturn(Optional.of(scan));

        mockMvc.perform(get("/reports/devices/agent-1/packages/latest")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
