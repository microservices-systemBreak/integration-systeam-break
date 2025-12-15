package com.systembreak.sb_api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Configuración de seguridad para el API Gateway.
 * 1. Habilita la seguridad de WebFlux.
 * 2. Configura el gateway como un Servidor de Recursos (Resource Server) de OAuth2.
 * 3. Define las reglas de autorización para las rutas.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // Deshabilitar CSRF porque usamos JWT (sin estado)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        // Rutas públicas:
                        // - Endpoints de Actuator para monitoreo
                        .pathMatchers("/actuator/**").permitAll()
                        // - Documentación de OpenAPI/Swagger
                        .pathMatchers("/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        // - Endpoint de login/token del servicio de autenticación
                        .pathMatchers("/auth/login", "/auth/token").permitAll()
                        // - Fallbacks del Circuit Breaker
                        .pathMatchers("/fallback/**").permitAll()
                        // Todas las demás rutas requieren autenticación
                        .anyExchange().authenticated()
                )
                // Configurar el servidor de recursos para validar JWTs
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {}) // La configuración se toma de application.yml
                );

        return http.build();
    }
}
