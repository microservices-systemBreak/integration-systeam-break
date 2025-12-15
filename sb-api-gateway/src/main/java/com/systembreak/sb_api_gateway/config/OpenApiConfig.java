package com.systembreak.sb_api_gateway.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de SpringDoc OpenAPI para el API Gateway.
 * 1. Define la información general de la API.
 * 2. Agrupa las APIs de los microservicios downstream para que aparezcan en Swagger UI.
 * 3. Configura el esquema de seguridad JWT para que se pueda usar en Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("SystemBreak API Gateway")
                        .version("1.0.0")
                        .description("Single entry point for the SystemBreak platform. Handles routing, security, and resilience."))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

    @Bean
    public GroupedOpenApi reportingApi() {
        return GroupedOpenApi.builder()
                .group("reporting-service")
                .pathsToMatch("/reports/**")
                .build();
    }

    @Bean
    public GroupedOpenApi coreApi() {
        return GroupedOpenApi.builder()
                .group("core-orchestrator")
                .pathsToMatch("/core/**")
                .build();
    }

    @Bean
    public GroupedOpenApi errorApi() {
        return GroupedOpenApi.builder()
                .group("error-monitor")
                .pathsToMatch("/errors/**")
                .build();
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("auth-service")
                .pathsToMatch("/auth/**")
                .build();
    }
}
