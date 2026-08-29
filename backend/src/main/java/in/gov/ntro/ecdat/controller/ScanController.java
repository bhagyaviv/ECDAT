package in.gov.ntro.ecdat.controller;

import in.gov.ntro.ecdat.entity.ScanRecordEntity;
import in.gov.ntro.ecdat.service.ScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/scan")
@RequiredArgsConstructor
@Tag(name = "Discovery Scanner", description = "Endpoints for launching AST scans and querying scan history")
public class ScanController {

    private final ScanService scanService;

    @PostMapping("/launch")
    @Operation(summary = "Launch automated multi-source discovery scan")
    public ResponseEntity<ScanRecordEntity> launchScan(@RequestBody Map<String, String> request) {
        String targetType = request.getOrDefault("targetType", "GIT");
        String targetRef = request.getOrDefault("targetRef", "github.com/enterprise/core-platform");
        return ResponseEntity.ok(scanService.launchDiscoveryScan(targetType, targetRef));
    }

    @GetMapping("/history")
    @Operation(summary = "Get recent scan execution records")
    public ResponseEntity<List<ScanRecordEntity>> getScanHistory() {
        return ResponseEntity.ok(scanService.getRecentScans());
    }
}
