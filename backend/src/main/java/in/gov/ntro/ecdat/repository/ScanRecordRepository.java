package in.gov.ntro.ecdat.repository;

import in.gov.ntro.ecdat.entity.ScanRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanRecordRepository extends JpaRepository<ScanRecordEntity, Long> {
    List<ScanRecordEntity> findTop10ByOrderByCreatedAtDesc();
}
