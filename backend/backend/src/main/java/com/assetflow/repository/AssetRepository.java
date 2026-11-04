package com.assetflow.repository;

import com.assetflow.entity.Asset;
import com.assetflow.entity.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetId(String assetId);
    boolean existsByAssetId(String assetId);
    boolean existsBySerialNumber(String serialNumber);
    List<Asset> findByStatus(AssetStatus status);
    List<Asset> findByAssignedToId(Long userId);

    @Query("SELECT a.status, COUNT(a) FROM Asset a GROUP BY a.status")
    List<Object[]> countByStatus();

    @Query("SELECT a.category.name, COUNT(a) FROM Asset a GROUP BY a.category.name")
    List<Object[]> countByCategory();
}