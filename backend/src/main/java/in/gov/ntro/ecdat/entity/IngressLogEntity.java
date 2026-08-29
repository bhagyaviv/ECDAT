package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingress_logs")
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
    private String action;

    @Column(name = "latency_ms", nullable = false)
    private double latencyMs;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public IngressLogEntity() {}

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTimestampStr() { return timestampStr; }
    public void setTimestampStr(String timestampStr) { this.timestampStr = timestampStr; }

    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }

    public String getTargetService() { return targetService; }
    public void setTargetService(String targetService) { this.targetService = targetService; }

    public String getCipherSuite() { return cipherSuite; }
    public void setCipherSuite(String cipherSuite) { this.cipherSuite = cipherSuite; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public double getLatencyMs() { return latencyMs; }
    public void setLatencyMs(double latencyMs) { this.latencyMs = latencyMs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
