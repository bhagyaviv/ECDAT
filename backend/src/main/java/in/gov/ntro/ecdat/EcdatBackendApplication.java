package in.gov.ntro.ecdat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcdatBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcdatBackendApplication.class, args);
        System.out.println("=================================================================");
        System.out.println("  ECDAT Spring Boot Backend Initialized Successfully (SIH 2026)  ");
        System.out.println("  API Docs: http://localhost:8080/swagger-ui.html                 ");
        System.out.println("  REST Endpoints: http://localhost:8080/api/v1/...                ");
        System.out.println("=================================================================");
    }
}
