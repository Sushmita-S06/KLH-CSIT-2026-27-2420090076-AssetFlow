package com.assetflow.service;

import com.assetflow.dto.AssetRequest;
import com.assetflow.dto.AssetResponse;
import com.assetflow.entity.Asset;
import com.assetflow.entity.AssetCondition;
import com.assetflow.entity.AssetStatus;
import com.assetflow.entity.Category;
import com.assetflow.entity.User;
import com.assetflow.exception.BadRequestException;
import com.assetflow.exception.ResourceNotFoundException;
import com.assetflow.repository.AssetRepository;
import com.assetflow.repository.CategoryRepository;
import com.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final QrCodeService qrCodeService;   // ← ADDED FOR QR

    public List<AssetResponse> getAll() {
        return assetRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AssetResponse getById(Long id) {
        return toResponse(assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + id)));
    }

    @Transactional
    public AssetResponse create(AssetRequest req) {
        if (assetRepository.existsByAssetId(req.getAssetId()))
            throw new BadRequestException("Asset ID already exists");
        if (req.getSerialNumber() != null && assetRepository.existsBySerialNumber(req.getSerialNumber()))
            throw new BadRequestException("Serial number already exists");

        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Asset a = Asset.builder()
                .assetId(req.getAssetId())
                .name(req.getName())
                .category(cat)
                .manufacturer(req.getManufacturer())
                .model(req.getModel())
                .serialNumber(req.getSerialNumber())
                .purchaseDate(req.getPurchaseDate())
                .purchaseCost(req.getPurchaseCost())
                .warrantyExpiry(req.getWarrantyExpiry())
                .location(req.getLocation())
                .status(req.getStatus() != null ? req.getStatus() : AssetStatus.AVAILABLE)
                .condition(req.getCondition() != null ? req.getCondition() : AssetCondition.NEW)
                .notes(req.getNotes())
                .build();

        if (req.getAssignedToId() != null) {
            User u = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            a.setAssignedTo(u);
            a.setStatus(AssetStatus.ASSIGNED);
        }

        return toResponse(assetRepository.save(a));
    }

    @Transactional
    public AssetResponse update(Long id, AssetRequest req) {
        Asset a = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        a.setName(req.getName());
        a.setCategory(cat);
        a.setManufacturer(req.getManufacturer());
        a.setModel(req.getModel());
        a.setSerialNumber(req.getSerialNumber());
        a.setPurchaseDate(req.getPurchaseDate());
        a.setPurchaseCost(req.getPurchaseCost());
        a.setWarrantyExpiry(req.getWarrantyExpiry());
        a.setLocation(req.getLocation());
        if (req.getStatus() != null) a.setStatus(req.getStatus());
        if (req.getCondition() != null) a.setCondition(req.getCondition());
        a.setNotes(req.getNotes());

        if (req.getAssignedToId() != null) {
            User u = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            a.setAssignedTo(u);
        } else {
            a.setAssignedTo(null);
        }

        return toResponse(assetRepository.save(a));
    }

    @Transactional
    public void delete(Long id) {
        if (!assetRepository.existsById(id))
            throw new ResourceNotFoundException("Asset not found: " + id);
        assetRepository.deleteById(id);
    }

    public AssetResponse toResponse(Asset a) {
        AssetResponse r = new AssetResponse();
        r.setId(a.getId());
        r.setAssetId(a.getAssetId());
        r.setName(a.getName());
        r.setCategory(a.getCategory() != null ? a.getCategory().getName() : null);
        r.setCategoryId(a.getCategory() != null ? a.getCategory().getId() : null);
        r.setManufacturer(a.getManufacturer());
        r.setModel(a.getModel());
        r.setSerialNumber(a.getSerialNumber());
        r.setPurchaseDate(a.getPurchaseDate());
        r.setPurchaseCost(a.getPurchaseCost());
        r.setWarrantyExpiry(a.getWarrantyExpiry());
        r.setLocation(a.getLocation());
        r.setStatus(a.getStatus() != null ? a.getStatus().name() : null);
        r.setCondition(a.getCondition() != null ? a.getCondition().name() : null);
        r.setAssignedToId(a.getAssignedTo() != null ? a.getAssignedTo().getId() : null);
        r.setAssignedToName(a.getAssignedTo() != null ? a.getAssignedTo().getFullName() : null);
        r.setNotes(a.getNotes());
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }

    // ==========================================
    // QR CODE METHODS — NEW
    // ==========================================

    /**
     * Generate a QR code PNG for an asset by database ID.
     * QR content format: ASSETFLOW|<assetId>  e.g. "ASSETFLOW|AST-001"
     */
    public byte[] generateQrForAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + id));
        String content = buildQrContent(asset);
        return qrCodeService.generateQrCode(content, 300, 300);
    }

    /**
     * Generate a QR code PNG by asset ID (user-facing code like AST-001).
     */
    public byte[] generateQrByAssetId(String assetId) {
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + assetId));
        String content = buildQrContent(asset);
        return qrCodeService.generateQrCode(content, 300, 300);
    }

    /**
     * Look up an asset by scanning the QR content.
     * Expected content: "ASSETFLOW|<assetId>"
     */
    public AssetResponse lookupByQrContent(String content) {
        if (content == null || !content.startsWith("ASSETFLOW|")) {
            throw new BadRequestException("Invalid QR code");
        }
        String assetId = content.substring("ASSETFLOW|".length());
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + assetId));
        return toResponse(asset);
    }

    private String buildQrContent(Asset asset) {
        return "ASSETFLOW|" + asset.getAssetId();
    }
}