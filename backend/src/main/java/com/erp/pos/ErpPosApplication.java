package com.erp.pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ErpPosApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpPosApplication.class, args);
    }
}
