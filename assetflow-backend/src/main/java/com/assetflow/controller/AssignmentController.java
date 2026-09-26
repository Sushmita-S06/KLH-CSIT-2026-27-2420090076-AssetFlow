package com.assetflow.controller;

import com.assetflow.dto.AssignRequest;
import com.assetflow.dto.ReturnRequest;
import com.assetflow.entity.Assignment;
import com.assetflow.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService service;

    @GetMapping
    public ResponseEntity<List<Assignment>> list() { return ResponseEntity.ok(service.getAll()); }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Assignment>> byUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.byUser(userId));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<List<Assignment>> byAsset(@PathVariable Long assetId) {
        return ResponseEntity.ok(service.byAsset(assetId));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Assignment> assign(@Valid @RequestBody AssignRequest req,
                                             Authentication auth) {
        return ResponseEntity.ok(service.assign(req, auth.getName()));
    }

    @PostMapping("/return/{assetId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Assignment> returnAsset(@PathVariable Long assetId,
                                                  @RequestBody(required = false) ReturnRequest req) {
        String remarks = req != null ? req.getRemarks() : null;
        return ResponseEntity.ok(service.returnAsset(assetId, remarks));
    }
}