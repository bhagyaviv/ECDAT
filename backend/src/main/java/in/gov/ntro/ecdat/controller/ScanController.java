package in.gov.ntro.ecdat.controller;

import in.gov.ntro.ecdat.entity.ScanRecordEntity;
import in.gov.ntro.ecdat.service.ScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/scan")
@Tag(name = "Discovery Scanner", description = "Endpoints for launching AST scans and querying scan history")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @PostMapping("/launch")
    @Operation(summary = "Launch automated multi-source discovery scan")
    public ResponseEntity<ScanRecordEntity> launchScan(@RequestBody(required = false) Map<String, String> request) {
        String targetType = (request != null && request.containsKey("targetType")) ? request.get("targetType") : "GIT";
        String targetRef = (request != null && request.containsKey("targetRef")) ? request.get("targetRef") : "github.com/enterprise/core-platform";
        return ResponseEntity.ok(scanService.launchDiscoveryScan(targetType, targetRef));
    }

    @GetMapping("/history")
    @Operation(summary = "Get recent scan execution records")
    public ResponseEntity<List<ScanRecordEntity>> getScanHistory() {
        return ResponseEntity.ok(scanService.getRecentScans());
    }
}
