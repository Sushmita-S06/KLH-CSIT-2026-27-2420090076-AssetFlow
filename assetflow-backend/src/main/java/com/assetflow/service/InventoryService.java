package com.assetflow.service;

import com.assetflow.entity.InventoryItem;
import com.assetflow.exception.BadRequestException;
import com.assetflow.exception.ResourceNotFoundException;
import com.assetflow.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository repo;

    public List<InventoryItem> getAll() { return repo.findAll(); }
    public List<InventoryItem> lowStock() { return repo.findLowStockItems(); }

    public InventoryItem create(InventoryItem item) {
        if (repo.existsBySku(item.getSku()))
            throw new BadRequestException("SKU already exists");
        return repo.save(item);
    }

    public InventoryItem update(Long id, InventoryItem item) {
        InventoryItem e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        e.setName(item.getName());
        e.setCategory(item.getCategory());
        e.setQuantity(item.getQuantity());
        e.setReorderLevel(item.getReorderLevel());
        e.setSupplier(item.getSupplier());
        e.setUnitPrice(item.getUnitPrice());
        return repo.save(e);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Item not found");
        repo.deleteById(id);
    }
}