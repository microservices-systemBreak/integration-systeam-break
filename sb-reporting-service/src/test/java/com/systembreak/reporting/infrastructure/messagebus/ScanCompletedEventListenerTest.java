package com.systembreak.reporting.infrastructure.messagebus;

import com.systembreak.reporting.application.dto.ScanCompletedEvent;
import com.systembreak.reporting.domain.ports.in.ProcessScanCompletedUseCase;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Instant;

public class ScanCompletedEventListenerTest {

    @Test
    void listener_calls_usecase_when_event_received() {
        ProcessScanCompletedUseCase useCase = Mockito.mock(ProcessScanCompletedUseCase.class);
        ScanCompletedEventListener listener = new ScanCompletedEventListener(useCase);

        ScanCompletedEvent.ScanResult result = new ScanCompletedEvent.ScanResult("LOW", 0, 5);
        ScanCompletedEvent event = new ScanCompletedEvent("SCAN_COMPLETED","job-1","endpoint-1","corr-1", Instant.now(), result);

        listener.handleScanCompletedEvent(event);

        Mockito.verify(useCase).processScanCompleted(
                Mockito.eq("job-1"),
                Mockito.eq("endpoint-1"),
                Mockito.eq("corr-1"),
                Mockito.any(Instant.class),
                Mockito.eq("LOW"),
                Mockito.eq(0),
                Mockito.eq(5)
        );
    }
}
