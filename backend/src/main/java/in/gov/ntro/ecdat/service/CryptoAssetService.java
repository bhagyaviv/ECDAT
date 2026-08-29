package in.gov.ntro.ecdat.service;

import in.gov.ntro.ecdat.entity.CryptoAssetEntity;
import in.gov.ntro.ecdat.repository.CryptoAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CryptoAssetService {

    private final CryptoAssetRepository assetRepository;

    public List<CryptoAssetEntity> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<CryptoAssetEntity> getAssetById(String id) {
        return assetRepository.findById(id);
    }

    public List<CryptoAssetEntity> getAssetsByRisk(String riskLevel) {
        return assetRepository.findByRiskLevel(riskLevel.toUpperCase());
    }

    public List<CryptoAssetEntity> getMoscaViolations() {
        return assetRepository.findByViolatingMoscaTrue();
    }

    public Map<String, Object> getQuantumReadinessStats() {
        long total = assetRepository.count();
        long vulnerable = assetRepository.countQuantumVulnerable();
        long resistant = assetRepository.countQuantumResistant();
        long moscaViolations = assetRepository.findByViolatingMoscaTrue().size();

        double score = total > 0 ? Math.round(((double) resistant / total) * 100.0) : 0;
        String grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D+";

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalAssets", total);
        stats.put("quantumVulnerableCount", vulnerable);
        stats.put("quantumResistantCount", resistant);
        stats.put("moscaViolationsCount", moscaViolations);
        stats.put("readinessScore", score);
        stats.put("readinessGrade", grade);
        stats.put("totalRiskExposureUSD", "$38,700,000 / year");

        return stats;
    }

    public Map<String, Object> generateCycloneDxCbomJson() {
        List<CryptoAssetEntity> assets = assetRepository.findAll();

        Map<String, Object> cbom = new LinkedHashMap<>();
        cbom.put("$schema", "http://cyclonedx.org/schema/bom-1.6.schema.json");
        cbom.put("bomFormat", "CycloneDX");
        cbom.put("specVersion", "1.6");
        cbom.put("serialNumber", "urn:uuid:7c8b2164-sih2026-ntro-ecdat-cbom-v1");
        cbom.put("version", 1);

        Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("timestamp", new Date().toInstant().toString());
        metadata.put("tools", List.of(Map.of(
            "vendor", "NTRO-SIH26164",
            "name", "ECDAT Spring Boot Discovery Engine",
            "version", "1.0.0"
        )));
        cbom.put("metadata", metadata);

        List<Map<String, Object>> components = new ArrayList<>();
        for (CryptoAssetEntity a : assets) {
            Map<String, Object> c = new LinkedHashMap<>();
            c.put("type", "cryptographic-asset");
            c.put("bom-ref", a.getCyclonedxRef());
            c.put("name", a.getName());
            c.put("group", a.getServiceName());
            
            Map<String, Object> cryptoProps = new LinkedHashMap<>();
            cryptoProps.put("assetType", a.getCryptoType());
            cryptoProps.put("oid", a.getOid());
            cryptoProps.put("nistStatus", a.getNistStatus());
            cryptoProps.put("fipsStatus", a.getFipsStatus());
            cryptoProps.put("quantumSecurityBits", a.getQuantumSecurityBits());
            cryptoProps.put("pqcMigrationTarget", a.getPqcNistStandard());
            
            c.put("cryptoProperties", cryptoProps);
            components.add(c);
        }
        cbom.put("components", components);

        return cbom;
    }

    public CryptoAssetEntity saveAsset(CryptoAssetEntity asset) {
        return assetRepository.save(asset);
    }
}
