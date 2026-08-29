package in.gov.ntro.ecdat.service;

import in.gov.ntro.ecdat.entity.ScanRecordEntity;
import in.gov.ntro.ecdat.repository.ScanRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ScanService {

    private final ScanRecordRepository scanRecordRepository;

    public ScanRecordEntity launchDiscoveryScan(String targetType, String targetRef) {
        // Simulates an AST scan run
        ScanRecordEntity record = ScanRecordEntity.builder()
                .scanTargetType(targetType != null ? targetType : "GIT")
                .targetReference(targetRef != null ? targetRef : "github.com/enterprise/core-platform")
                .filesAnalyzed(48912)
                .dependenciesAnalyzed(1736)
                .certificatesDiscovered(214)
                .cryptoAssetsDiscovered(6)
                .criticalVulnerabilities(4)
                .status("COMPLETED")
                .durationMs(4800)
                .build();

        return scanRecordRepository.save(record);
    }

    public List<ScanRecordEntity> getRecentScans() {
        return scanRecordRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
