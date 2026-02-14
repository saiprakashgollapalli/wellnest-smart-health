package com.wellnest.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Application beans – ModelMapper and Swagger/OpenAPI configuration.
 */
@Configuration
public class AppConfig {

    /** ModelMapper for DTO <-> Entity conversion. */
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setSkipNullEnabled(true);
        return mapper;
    }

    /** OpenAPI / Swagger with JWT security scheme. */
    @Bean
    public OpenAPI wellNestOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("WellNest – Health & Wellness API")
                        .description("REST API documentation for WellNest smart health platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("WellNest Team")
                                .email("dev@wellnest.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat("JWT")
                                        .scheme("bearer")));
    }
}