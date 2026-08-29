package in.gov.ntro.ecdat.service;

import in.gov.ntro.ecdat.entity.IngressLogEntity;
import in.gov.ntro.ecdat.repository.IngressLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TrafficService {

    private final IngressLogRepository ingressLogRepository;

    public List<IngressLogEntity> getRecentHandshakes() {
        return ingressLogRepository.findTop20ByOrderByCreatedAtDesc();
    }

    public Map<String, Object> getTrafficMetrics() {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("ingressThroughputReqPerSec", 8420);
        metrics.put("pqcHybridShieldPercentage", 88.4);
        metrics.put("blockedRateReqPerSec", 142);
        metrics.put("averageLatencyMs", 1.4);
        metrics.put("pqcProtocol", "FIPS 203 (ML-KEM-768)");
        metrics.put("rateLimiterActive", true);
        metrics.put("rateLimitCapacity", 8500);

        return metrics;
    }

    public IngressLogEntity logHandshake(IngressLogEntity log) {
        return ingressLogRepository.save(log);
    }
}
