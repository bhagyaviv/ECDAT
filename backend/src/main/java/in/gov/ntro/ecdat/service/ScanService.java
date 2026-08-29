package in.gov.ntro.ecdat.service;

import in.gov.ntro.ecdat.entity.ScanRecordEntity;
import in.gov.ntro.ecdat.repository.ScanRecordRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScanService {

    private final ScanRecordRepository scanRecordRepository;

    public ScanService(ScanRecordRepository scanRecordRepository) {
        this.scanRecordRepository = scanRecordRepository;
    }

    public ScanRecordEntity launchDiscoveryScan(String targetType, String targetRef) {
        ScanRecordEntity record = new ScanRecordEntity();
        record.setScanTargetType(targetType != null ? targetType : "GIT");
        record.setTargetReference(targetRef != null ? targetRef : "github.com/enterprise/core-platform");
        record.setFilesAnalyzed(48912);
        record.setDependenciesAnalyzed(1736);
        record.setCertificatesDiscovered(214);
        record.setCryptoAssetsDiscovered(6);
        record.setCriticalVulnerabilities(4);
        record.setStatus("COMPLETED");
        record.setDurationMs(4800);

        return scanRecordRepository.save(record);
    }

    public List<ScanRecordEntity> getRecentScans() {
        return scanRecordRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
