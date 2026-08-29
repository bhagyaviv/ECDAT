package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scan_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scan_target_type", length = 50, nullable = false)
    private String scanTargetType; // GIT, ZIP, CERT, CONTAINER, ENDPOINT

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
    private String status; // COMPLETED, FAILED

    @Column(name = "duration_ms", nullable = false)
    private long durationMs;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
