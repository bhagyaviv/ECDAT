package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CryptoAssetEntity {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "algorithm", length = 100, nullable = false)
    private String algorithm;

    @Column(name = "key_size", length = 50, nullable = false)
    private String keySize;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "repository", nullable = false)
    private String repository;

    @Column(name = "line_numbers", length = 50)
    private String lineNumbers;

    @Column(name = "risk_level", length = 20, nullable = false)
    private String riskLevel;

    @Column(name = "migration_priority", length = 20, nullable = false)
    private String migrationPriority;

    // Mosca Theorem Factors (X + Y > Z)
    @Column(name = "data_lifetime_years", nullable = false)
    private int dataLifetimeYears;

    @Column(name = "migration_time_years", nullable = false)
    private int migrationTimeYears;

    @Column(name = "threat_timeline_years", nullable = false)
    private int threatTimelineYears;

    @Column(name = "is_violating_mosca", nullable = false)
    private boolean violatingMosca;

    @Column(name = "hndl_vulnerability_level", length = 50, nullable = false)
    private String hndlVulnerabilityLevel;

    @Column(name = "business_criticality", length = 50, nullable = false)
    private String businessCriticality;

    // Downstream Dependency Service
    @Column(name = "service_id", length = 64, nullable = false)
    private String serviceId;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "service_type", length = 50, nullable = false)
    private String serviceType;

    @Column(name = "impacted_applications", columnDefinition = "TEXT")
    private String impactedApplications;

    @Column(name = "sensitive_data_types", columnDefinition = "TEXT")
    private String sensitiveDataTypes;

    @Column(name = "data_classification", length = 100)
    private String dataClassification;

    @Column(name = "annual_risk_exposure_usd", length = 50)
    private String annualRiskExposureUsd;

    // NIST Post-Quantum Recommendation
    @Column(name = "pqc_nist_standard", nullable = false)
    private String pqcNistStandard;

    @Column(name = "pqc_algorithm_family", length = 100, nullable = false)
    private String pqcAlgorithmFamily;

    @Column(name = "pqc_recommended_action", columnDefinition = "TEXT")
    private String pqcRecommendedAction;

    @Column(name = "pqc_migration_phase", length = 100)
    private String pqcMigrationPhase;

    @Column(name = "pqc_effort_weeks")
    private Integer pqcEffortWeeks;

    @Column(name = "pqc_code_before", columnDefinition = "TEXT")
    private String pqcCodeBefore;

    @Column(name = "pqc_code_after", columnDefinition = "TEXT")
    private String pqcCodeAfter;

    // CycloneDX 1.6 CBOM Metadata
    @Column(name = "cyclonedx_ref", length = 100)
    private String cyclonedxRef;

    @Column(name = "crypto_type", length = 50)
    private String cryptoType;

    @Column(name = "oid", length = 100)
    private String oid;

    @Column(name = "nist_status", length = 50)
    private String nistStatus;

    @Column(name = "fips_status", length = 50)
    private String fipsStatus;

    @Column(name = "quantum_security_bits")
    private int quantumSecurityBits;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "quantum_attack_vector", columnDefinition = "TEXT")
    private String quantumAttackVector;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @PrePersist
    public void prePersist() {
        if (this.detectedAt == null) {
            this.detectedAt = LocalDateTime.now();
        }
        // Auto-evaluate Mosca Theorem
        this.violatingMosca = (this.dataLifetimeYears + this.migrationTimeYears) > this.threatTimelineYears;
    }
}
