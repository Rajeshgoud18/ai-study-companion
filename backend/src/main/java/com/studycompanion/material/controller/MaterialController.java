package com.studycompanion.material.controller;

import com.studycompanion.material.dto.MaterialResponse;
import com.studycompanion.material.service.MaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<MaterialResponse> uploadMaterial(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        MaterialResponse response =
                materialService.uploadMaterial(
                        userId,
                        projectId,
                        file
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getMaterials(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        return ResponseEntity.ok(
                materialService.getProjectMaterials(
                        userId,
                        projectId
                )
        );
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable Long projectId,
            @PathVariable Long materialId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        materialService.deleteMaterial(
                userId,
                projectId,
                materialId
        );

        return ResponseEntity.noContent().build();
    }
}