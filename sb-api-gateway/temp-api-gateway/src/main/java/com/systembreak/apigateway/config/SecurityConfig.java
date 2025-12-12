package com.systembreak.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable) // Deshabilita CSRF para APIs sin estado
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/auth/**").permitAll() // Permitir acceso a rutas de autenticación
                .pathMatchers("/actuator/**").permitAll() // Permitir acceso a Actuator
                .pathMatchers("/swagger-ui/**").permitAll() // Permitir acceso a Swagger UI
                .pathMatchers("/v3/api-docs/**").permitAll() // Permitir acceso a la definición de OpenAPI
                .anyExchange().authenticated() // Todas las demás peticiones requieren autenticación
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> {}) // Habilita la validación de JWT
            );
        return http.build();
    }
}
