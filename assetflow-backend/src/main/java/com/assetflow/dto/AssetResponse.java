package com.assetflow.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AssetResponse {
    private Long id;
    private String assetId;
    private String name;
    private String category;
    private Long categoryId;
    private String manufacturer;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private LocalDate warrantyExpiry;
    private String location;
    private String status;
    private String condition;
    private Long assignedToId;
    private String assignedToName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}