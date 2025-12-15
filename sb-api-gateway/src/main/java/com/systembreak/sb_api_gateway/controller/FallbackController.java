package com.systembreak.sb_api_gateway.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controlador para manejar las respuestas de fallback del Circuit Breaker.
 * Devuelve una respuesta HTTP 503 (Service Unavailable) cuando un microservicio no está disponible.
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    private static final Logger log = LoggerFactory.getLogger(FallbackController.class);

    private Mono<ResponseEntity<Map<String, String>>> createFallbackResponse(String serviceName) {
        log.warn("Fallback triggered for service: {}", serviceName);
        Map<String, String> response = Map.of(
                "status", "SERVICE_UNAVAILABLE",
                "message", "The " + serviceName + " is temporarily unavailable. Please try again later."
        );
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @GetMapping("/auth")
    public Mono<ResponseEntity<Map<String, String>>> authServiceFallback() {
        return createFallbackResponse("Authentication Service");
    }

    @GetMapping("/reporting")
    public Mono<ResponseEntity<Map<String, String>>> reportingServiceFallback() {
        return createFallbackResponse("Reporting Service");
    }

    @GetMapping("/core")
    public Mono<ResponseEntity<Map<String, String>>> coreServiceFallback() {
        return createFallbackResponse("Core Orchestrator Service");
    }

    @GetMapping("/error")
    public Mono<ResponseEntity<Map<String, String>>> errorMonitorFallback() {
        return createFallbackResponse("Error Monitor Service");
    }
}
