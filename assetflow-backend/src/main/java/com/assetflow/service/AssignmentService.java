package com.assetflow.service;

import com.assetflow.dto.AssignRequest;
import com.assetflow.entity.*;
import com.assetflow.exception.BadRequestException;
import com.assetflow.exception.ResourceNotFoundException;
import com.assetflow.repository.AssetRepository;
import com.assetflow.repository.AssignmentRepository;
import com.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Transactional
    public Assignment assign(AssignRequest req, String assignedBy) {
        Asset asset = assetRepository.findById(req.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));
        if (asset.getStatus() == AssetStatus.ASSIGNED)
            throw new BadRequestException("Asset already assigned");
        if (asset.getStatus() == AssetStatus.RETIRED || asset.getStatus() == AssetStatus.LOST)
            throw new BadRequestException("Cannot assign a " + asset.getStatus() + " asset");

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        asset.setAssignedTo(user);
        asset.setStatus(AssetStatus.ASSIGNED);
        assetRepository.save(asset);

        Assignment a = Assignment.builder()
                .asset(asset)
                .user(user)
                .assignedAt(LocalDateTime.now())
                .assignedBy(assignedBy)
                .remarks(req.getRemarks())
                .status(AssignmentStatus.ACTIVE)
                .build();
        return assignmentRepository.save(a);
    }

    @Transactional
    public Assignment returnAsset(Long assetId, String remarks) {
        Assignment a = assignmentRepository.findByAssetIdAndStatus(assetId, AssignmentStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("No active assignment for this asset"));
        a.setReturnedAt(LocalDateTime.now());
        a.setStatus(AssignmentStatus.RETURNED);
        if (remarks != null) a.setRemarks(remarks);
        assignmentRepository.save(a);

        Asset asset = a.getAsset();
        asset.setAssignedTo(null);
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        return a;
    }

    public List<Assignment> getAll() { return assignmentRepository.findAll(); }
    public List<Assignment> byUser(Long userId) { return assignmentRepository.findByUserId(userId); }
    public List<Assignment> byAsset(Long assetId) { return assignmentRepository.findByAssetId(assetId); }
}