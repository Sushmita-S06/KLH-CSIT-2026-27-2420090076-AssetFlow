package com.assetflow.controller;

import com.assetflow.dto.AssetRequest;
import com.assetflow.dto.AssetResponse;
import com.assetflow.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public ResponseEntity<List<AssetResponse>> list() {
        return ResponseEntity.ok(assetService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<AssetResponse> create(@Valid @RequestBody AssetRequest req) {
        return ResponseEntity.ok(assetService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<AssetResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody AssetRequest req) {
        return ResponseEntity.ok(assetService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        assetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // QR CODE ENDPOINTS — NEW
    // ==========================================

    /**
     * Generate a QR code PNG for an asset by database ID.
     * Example: GET /api/assets/1/qr
     */
    @GetMapping(value = "/{id}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrById(@PathVariable Long id) {
        byte[] qr = assetService.generateQrForAsset(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header("Cache-Control", "no-cache")
                .body(qr);
    }

    /**
     * Generate a QR code PNG by asset code (e.g., AST-001).
     * Example: GET /api/assets/qr/AST-001
     */
    @GetMapping(value = "/qr/{assetId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrByAssetId(@PathVariable String assetId) {
        byte[] qr = assetService.generateQrByAssetId(assetId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header("Cache-Control", "no-cache")
                .body(qr);
    }

    /**
     * Look up asset by scanning QR content (used by the frontend scanner).
     * Example: GET /api/assets/scan?content=ASSETFLOW|AST-001
     */
    @GetMapping("/scan")
    public ResponseEntity<AssetResponse> scanQr(@RequestParam String content) {
        return ResponseEntity.ok(assetService.lookupByQrContent(content));
    }
}