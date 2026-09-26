package com.assetflow.dto;

import com.assetflow.entity.AssetCondition;
import com.assetflow.entity.AssetStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AssetRequest {
    @NotBlank
    private String assetId;
    @NotBlank
    private String name;
    @NotNull
    private Long categoryId;
    private String manufacturer;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private LocalDate warrantyExpiry;
    private String location;
    private AssetStatus status;
    private AssetCondition condition;
    private Long assignedToId;
    private String notes;
}