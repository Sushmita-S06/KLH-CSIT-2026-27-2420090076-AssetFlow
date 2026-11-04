package com.assetflow.repository;

import com.assetflow.entity.Assignment;
import com.assetflow.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByUserId(Long userId);
    List<Assignment> findByAssetId(Long assetId);
    Optional<Assignment> findByAssetIdAndStatus(Long assetId, AssignmentStatus status);
    List<Assignment> findByStatus(AssignmentStatus status);
}