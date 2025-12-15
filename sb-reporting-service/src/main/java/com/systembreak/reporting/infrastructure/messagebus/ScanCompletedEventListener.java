package com.systembreak.reporting.infrastructure.messagebus;

import com.systembreak.reporting.application.dto.ScanCompletedEvent;
import com.systembreak.reporting.domain.ports.in.ProcessScanCompletedUseCase;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScanCompletedEventListener {

    private static final Logger logger = LoggerFactory.getLogger(ScanCompletedEventListener.class);
    private final ProcessScanCompletedUseCase processScanCompletedUseCase;

    @RabbitListener(queues = "${spring.rabbitmq.queues.scan-completed}")
    public void handleScanCompletedEvent(ScanCompletedEvent event) {
        logger.info("Received ScanCompletedEvent: {}", event);
        try {
            processScanCompletedUseCase.processScanCompleted(
                    event.getJobId(),
                    event.getEndpointId(),
                    event.getCorrelationId(),
                    event.getCompletedAt(),
                    event.getResult().getOverallSeverity(),
                    event.getResult().getVulnerabilitiesFound(),
                    event.getResult().getPackagesAnalyzed()
            );
            logger.info("Scan completed event processed successfully for jobId: {}", event.getJobId());
        } catch (Exception e) {
            logger.error("Error processing ScanCompletedEvent for jobId: {}", event.getJobId(), e);
            // Aquí se podría publicar un evento de error a RabbitMQ para el sb-error-monitor
        }
    }
}
