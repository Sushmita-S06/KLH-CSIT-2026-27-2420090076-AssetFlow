package com.assetflow.repository;

import com.assetflow.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    boolean existsBySku(String sku);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.reorderLevel")
    List<InventoryItem> findLowStockItems();
}