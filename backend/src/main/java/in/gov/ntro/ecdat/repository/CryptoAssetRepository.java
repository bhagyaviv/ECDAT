package in.gov.ntro.ecdat.repository;

import in.gov.ntro.ecdat.entity.CryptoAssetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CryptoAssetRepository extends JpaRepository<CryptoAssetEntity, String> {

    List<CryptoAssetEntity> findByRiskLevel(String riskLevel);

    List<CryptoAssetEntity> findByCategory(String category);

    List<CryptoAssetEntity> findByViolatingMoscaTrue();

    @Query("SELECT COUNT(a) FROM CryptoAssetEntity a WHERE a.riskLevel IN ('CRITICAL', 'HIGH')")
    long countQuantumVulnerable();

    @Query("SELECT COUNT(a) FROM CryptoAssetEntity a WHERE a.riskLevel = 'LOW'")
    long countQuantumResistant();
}
