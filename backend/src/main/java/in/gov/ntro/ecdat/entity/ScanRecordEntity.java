package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_records")
public class ScanRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scan_target_type", length = 50, nullable = false)
    private String scanTargetType;

    @Column(name = "target_reference", nullable = false)
    private String targetReference;

    @Column(name = "files_analyzed", nullable = false)
    private int filesAnalyzed;

    @Column(name = "dependencies_analyzed", nullable = false)
    private int dependenciesAnalyzed;

    @Column(name = "certificates_discovered", nullable = false)
    private int certificatesDiscovered;

    @Column(name = "crypto_assets_discovered", nullable = false)
    private int cryptoAssetsDiscovered;

    @Column(name = "critical_vulnerabilities", nullable = false)
    private int criticalVulnerabilities;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "duration_ms", nullable = false)
    private long durationMs;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public ScanRecordEntity() {}

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getScanTargetType() { return scanTargetType; }
    public void setScanTargetType(String scanTargetType) { this.scanTargetType = scanTargetType; }

    public String getTargetReference() { return targetReference; }
    public void setTargetReference(String targetReference) { this.targetReference = targetReference; }

    public int getFilesAnalyzed() { return filesAnalyzed; }
    public void setFilesAnalyzed(int filesAnalyzed) { this.filesAnalyzed = filesAnalyzed; }

    public int getDependenciesAnalyzed() { return dependenciesAnalyzed; }
    public void setDependenciesAnalyzed(int dependenciesAnalyzed) { this.dependenciesAnalyzed = dependenciesAnalyzed; }

    public int getCertificatesDiscovered() { return certificatesDiscovered; }
    public void setCertificatesDiscovered(int certificatesDiscovered) { this.certificatesDiscovered = certificatesDiscovered; }

    public int getCryptoAssetsDiscovered() { return cryptoAssetsDiscovered; }
    public void setCryptoAssetsDiscovered(int cryptoAssetsDiscovered) { this.cryptoAssetsDiscovered = cryptoAssetsDiscovered; }

    public int getCriticalVulnerabilities() { return criticalVulnerabilities; }
    public void setCriticalVulnerabilities(int criticalVulnerabilities) { this.criticalVulnerabilities = criticalVulnerabilities; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
