package in.gov.ntro.ecdat.controller;

import in.gov.ntro.ecdat.entity.IngressLogEntity;
import in.gov.ntro.ecdat.service.TrafficService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/traffic")
@Tag(name = "Traffic & Ingress Shield", description = "Endpoints for live cipher handshake telemetry and rate limiting")
public class TrafficController {

    private final TrafficService trafficService;

    public TrafficController(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get live gateway traffic throughput and PQC shielding metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(trafficService.getTrafficMetrics());
    }

    @GetMapping("/handshakes")
    @Operation(summary = "Get recent cipher handshake telemetry logs")
    public ResponseEntity<List<IngressLogEntity>> getHandshakes() {
        return ResponseEntity.ok(trafficService.getRecentHandshakes());
    }

    @PostMapping("/handshakes")
    @Operation(summary = "Log an inspected TLS handshake event")
    public ResponseEntity<IngressLogEntity> logHandshake(@RequestBody IngressLogEntity log) {
        return ResponseEntity.ok(trafficService.logHandshake(log));
    }
}
