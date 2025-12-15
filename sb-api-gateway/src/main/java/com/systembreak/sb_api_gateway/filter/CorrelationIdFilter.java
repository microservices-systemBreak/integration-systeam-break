package com.systembreak.sb_api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Filtro global para gestionar el X-Correlation-Id.
 * 1. Si la cabecera X-Correlation-Id no viene en la solicitud, la genera.
 * 2. Propaga la cabecera a los servicios downstream.
 * 3. Añade el correlationId al contexto de logging (MDC) para trazabilidad en logs.
 */
@Component
public class CorrelationIdFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(CorrelationIdFilter.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    private static final String CORRELATION_ID_LOG_VAR = "correlationId";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String correlationId = getOrGenerateCorrelationId(request);

        // Añadir el correlationId al contexto del logger (MDC)
        MDC.put(CORRELATION_ID_LOG_VAR, correlationId);
        log.debug("Processing request with Correlation ID: {}", correlationId);

        // Crear una nueva solicitud con la cabecera X-Correlation-Id
        ServerHttpRequest newRequest = request.mutate()
                .header(CORRELATION_ID_HEADER, correlationId)
                .build();

        // Crear un nuevo exchange con la solicitud modificada
        ServerWebExchange newExchange = exchange.mutate().request(newRequest).build();

        // Limpiar el MDC después de que la cadena de filtros termine
        return chain.filter(newExchange)
                .doFinally(signalType -> MDC.remove(CORRELATION_ID_LOG_VAR));
    }

    /**
     * Define el orden del filtro. Debe ejecutarse antes que otros filtros
     * que puedan necesitar el correlationId.
     * @return El orden del filtro.
     */
    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE; // Ejecutar este filtro primero
    }

    private String getOrGenerateCorrelationId(ServerHttpRequest request) {
        String correlationId = request.getHeaders().getFirst(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
            log.info("No X-Correlation-Id found in header. Generated new one: {}", correlationId);
        }
        return correlationId;
    }
}
