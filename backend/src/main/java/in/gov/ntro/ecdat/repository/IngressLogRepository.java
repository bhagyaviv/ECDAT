package in.gov.ntro.ecdat.repository;

import in.gov.ntro.ecdat.entity.IngressLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngressLogRepository extends JpaRepository<IngressLogEntity, Long> {
    List<IngressLogEntity> findTop20ByOrderByCreatedAtDesc();
}
