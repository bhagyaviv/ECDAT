package in.gov.ntro.ecdat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_assets")
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

    public CryptoAssetEntity() {}

    @PrePersist
    public void prePersist() {
        if (this.detectedAt == null) {
            this.detectedAt = LocalDateTime.now();
        }
        this.violatingMosca = (this.dataLifetimeYears + this.migrationTimeYears) > this.threatTimelineYears;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public String getKeySize() { return keySize; }
    public void setKeySize(String keySize) { this.keySize = keySize; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRepository() { return repository; }
    public void setRepository(String repository) { this.repository = repository; }

    public String getLineNumbers() { return lineNumbers; }
    public void setLineNumbers(String lineNumbers) { this.lineNumbers = lineNumbers; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getMigrationPriority() { return migrationPriority; }
    public void setMigrationPriority(String migrationPriority) { this.migrationPriority = migrationPriority; }

    public int getDataLifetimeYears() { return dataLifetimeYears; }
    public void setDataLifetimeYears(int dataLifetimeYears) { this.dataLifetimeYears = dataLifetimeYears; }

    public int getMigrationTimeYears() { return migrationTimeYears; }
    public void setMigrationTimeYears(int migrationTimeYears) { this.migrationTimeYears = migrationTimeYears; }

    public int getThreatTimelineYears() { return threatTimelineYears; }
    public void setThreatTimelineYears(int threatTimelineYears) { this.threatTimelineYears = threatTimelineYears; }

    public boolean isViolatingMosca() { return violatingMosca; }
    public void setViolatingMosca(boolean violatingMosca) { this.violatingMosca = violatingMosca; }

    public String getHndlVulnerabilityLevel() { return hndlVulnerabilityLevel; }
    public void setHndlVulnerabilityLevel(String hndlVulnerabilityLevel) { this.hndlVulnerabilityLevel = hndlVulnerabilityLevel; }

    public String getBusinessCriticality() { return businessCriticality; }
    public void setBusinessCriticality(String businessCriticality) { this.businessCriticality = businessCriticality; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getImpactedApplications() { return impactedApplications; }
    public void setImpactedApplications(String impactedApplications) { this.impactedApplications = impactedApplications; }

    public String getSensitiveDataTypes() { return sensitiveDataTypes; }
    public void setSensitiveDataTypes(String sensitiveDataTypes) { this.sensitiveDataTypes = sensitiveDataTypes; }

    public String getDataClassification() { return dataClassification; }
    public void setDataClassification(String dataClassification) { this.dataClassification = dataClassification; }

    public String getAnnualRiskExposureUsd() { return annualRiskExposureUsd; }
    public void setAnnualRiskExposureUsd(String annualRiskExposureUsd) { this.annualRiskExposureUsd = annualRiskExposureUsd; }

    public String getPqcNistStandard() { return pqcNistStandard; }
    public void setPqcNistStandard(String pqcNistStandard) { this.pqcNistStandard = pqcNistStandard; }

    public String getPqcAlgorithmFamily() { return pqcAlgorithmFamily; }
    public void setPqcAlgorithmFamily(String pqcAlgorithmFamily) { this.pqcAlgorithmFamily = pqcAlgorithmFamily; }

    public String getPqcRecommendedAction() { return pqcRecommendedAction; }
    public void setPqcRecommendedAction(String pqcRecommendedAction) { this.pqcRecommendedAction = pqcRecommendedAction; }

    public String getPqcMigrationPhase() { return pqcMigrationPhase; }
    public void setPqcMigrationPhase(String pqcMigrationPhase) { this.pqcMigrationPhase = pqcMigrationPhase; }

    public Integer getPqcEffortWeeks() { return pqcEffortWeeks; }
    public void setPqcEffortWeeks(Integer pqcEffortWeeks) { this.pqcEffortWeeks = pqcEffortWeeks; }

    public String getPqcCodeBefore() { return pqcCodeBefore; }
    public void setPqcCodeBefore(String pqcCodeBefore) { this.pqcCodeBefore = pqcCodeBefore; }

    public String getPqcCodeAfter() { return pqcCodeAfter; }
    public void setPqcCodeAfter(String pqcCodeAfter) { this.pqcCodeAfter = pqcCodeAfter; }

    public String getCyclonedxRef() { return cyclonedxRef; }
    public void setCyclonedxRef(String cyclonedxRef) { this.cyclonedxRef = cyclonedxRef; }

    public String getCryptoType() { return cryptoType; }
    public void setCryptoType(String cryptoType) { this.cryptoType = cryptoType; }

    public String getOid() { return oid; }
    public void setOid(String oid) { this.oid = oid; }

    public String getNistStatus() { return nistStatus; }
    public void setNistStatus(String nistStatus) { this.nistStatus = nistStatus; }

    public String getFipsStatus() { return fipsStatus; }
    public void setFipsStatus(String fipsStatus) { this.fipsStatus = fipsStatus; }

    public int getQuantumSecurityBits() { return quantumSecurityBits; }
    public void setQuantumSecurityBits(int quantumSecurityBits) { this.quantumSecurityBits = quantumSecurityBits; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getQuantumAttackVector() { return quantumAttackVector; }
    public void setQuantumAttackVector(String quantumAttackVector) { this.quantumAttackVector = quantumAttackVector; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
}
