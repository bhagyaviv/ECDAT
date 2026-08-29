package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ingress_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngressLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp_str", length = 50, nullable = false)
    private String timestampStr;

    @Column(name = "client_ip", length = 50, nullable = false)
    private String clientIp;

    @Column(name = "target_service", nullable = false)
    private String targetService;

    @Column(name = "cipher_suite", nullable = false)
    private String cipherSuite;

    @Column(name = "protocol", length = 50, nullable = false)
    private String protocol;

    @Column(name = "action", length = 50, nullable = false)
    private String action; // ALLOWED (PQC), UPGRADED, THROTTLED, BLOCKED

    @Column(name = "latency_ms", nullable = false)
    private double latencyMs;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
