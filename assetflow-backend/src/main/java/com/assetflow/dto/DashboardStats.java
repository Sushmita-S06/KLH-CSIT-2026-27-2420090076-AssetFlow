package com.assetflow.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStats {
    private long totalAssets;
    private long availableAssets;
    private long assignedAssets;
    private long maintenanceAssets;
    private long retiredAssets;
    private long lostAssets;
    private long totalUsers;
    private long totalCategories;
    private long lowStockItems;
    private Map<String, Long> assetsByCategory;
    private Map<String, Long> assetsByStatus;
}