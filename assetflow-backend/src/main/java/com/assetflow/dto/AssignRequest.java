package com.assetflow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignRequest {
    @NotNull
    private Long assetId;
    @NotNull
    private Long userId;
    private String remarks;
}