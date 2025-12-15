package com.systembreak.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CorrelationIdGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(CorrelationIdGlobalFilter.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String correlationId = request.getHeaders().getFirst(CORRELATION_ID_HEADER);

        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = generateCorrelationId();
            logger.debug("Generated new Correlation ID: {}", correlationId);
        } else {
            logger.debug("Existing Correlation ID found: {}", correlationId);
        }

        // Add Correlation ID to the request for downstream services
        ServerHttpRequest modifiedRequest = request.mutate()
                .header(CORRELATION_ID_HEADER, correlationId)
                .build();

        // Add Correlation ID to the response for the client
        exchange.getResponse().getHeaders().add(CORRELATION_ID_HEADER, correlationId);

        logger.info("Processing request with Correlation ID: {} for path: {}", correlationId, request.getPath());

        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    private String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }

    @Override
    public int getOrder() {
        // Ensure this filter runs early in the chain
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
