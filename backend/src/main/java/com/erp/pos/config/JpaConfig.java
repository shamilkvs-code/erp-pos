package com.erp.pos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.erp.pos.repository")
public class JpaConfig {
    // This configuration class is used to enable JPA repositories
}
