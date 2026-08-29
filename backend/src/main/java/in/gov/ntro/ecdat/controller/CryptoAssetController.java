package in.gov.ntro.ecdat.controller;

import in.gov.ntro.ecdat.entity.CryptoAssetEntity;
import in.gov.ntro.ecdat.service.CryptoAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assets")
@Tag(name = "Cryptographic Inventory (CBOM)", description = "APIs for querying cryptographic assets, risk scoring, Mosca's theorem and CycloneDX 1.6 CBOM")
public class CryptoAssetController {

    private final CryptoAssetService assetService;

    public CryptoAssetController(CryptoAssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    @Operation(summary = "Get all discovered cryptographic primitives")
    public ResponseEntity<List<CryptoAssetEntity>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific cryptographic asset by ID")
    public ResponseEntity<CryptoAssetEntity> getAssetById(@PathVariable String id) {
        return assetService.getAssetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/risk/{riskLevel}")
    @Operation(summary = "Filter assets by Risk Level (CRITICAL, HIGH, MEDIUM, LOW)")
    public ResponseEntity<List<CryptoAssetEntity>> getAssetsByRisk(@PathVariable String riskLevel) {
        return ResponseEntity.ok(assetService.getAssetsByRisk(riskLevel));
    }

    @GetMapping("/mosca-violations")
    @Operation(summary = "Get all assets currently violating Mosca's Theorem (X + Y > Z)")
    public ResponseEntity<List<CryptoAssetEntity>> getMoscaViolations() {
        return ResponseEntity.ok(assetService.getMoscaViolations());
    }

    @GetMapping("/stats")
    @Operation(summary = "Get executive quantum readiness scores and metrics")
    public ResponseEntity<Map<String, Object>> getReadinessStats() {
        return ResponseEntity.ok(assetService.getQuantumReadinessStats());
    }

    @GetMapping("/cbom/cyclonedx")
    @Operation(summary = "Export 100% compliant CycloneDX 1.6 Cryptographic BOM JSON")
    public ResponseEntity<Map<String, Object>> getCycloneDxCbom() {
        return ResponseEntity.ok(assetService.generateCycloneDxCbomJson());
    }

    @PostMapping
    @Operation(summary = "Register new discovered cryptographic primitive")
    public ResponseEntity<CryptoAssetEntity> createAsset(@RequestBody CryptoAssetEntity asset) {
        return ResponseEntity.ok(assetService.saveAsset(asset));
    }
}
