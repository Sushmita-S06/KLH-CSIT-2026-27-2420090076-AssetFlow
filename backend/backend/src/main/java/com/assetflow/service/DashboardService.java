package com.assetflow.service;

import com.assetflow.dto.DashboardStats;
import com.assetflow.entity.AssetStatus;
import com.assetflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryItemRepository inventoryRepository;

    public DashboardStats getStats() {
        DashboardStats s = new DashboardStats();
        s.setTotalAssets(assetRepository.count());
        s.setAvailableAssets(assetRepository.findByStatus(AssetStatus.AVAILABLE).size());
        s.setAssignedAssets(assetRepository.findByStatus(AssetStatus.ASSIGNED).size());
        s.setMaintenanceAssets(assetRepository.findByStatus(AssetStatus.UNDER_MAINTENANCE).size());
        s.setRetiredAssets(assetRepository.findByStatus(AssetStatus.RETIRED).size());
        s.setLostAssets(assetRepository.findByStatus(AssetStatus.LOST).size());
        s.setTotalUsers(userRepository.count());
        s.setTotalCategories(categoryRepository.count());
        s.setLowStockItems(inventoryRepository.findLowStockItems().size());

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (Object[] row : assetRepository.countByStatus())
            byStatus.put(((AssetStatus) row[0]).name(), (Long) row[1]);
        s.setAssetsByStatus(byStatus);

        Map<String, Long> byCat = new LinkedHashMap<>();
        for (Object[] row : assetRepository.countByCategory())
            byCat.put((String) row[0], (Long) row[1]);
        s.setAssetsByCategory(byCat);

        return s;
    }
}