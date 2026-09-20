package com.studycompanion.material.service;

import com.studycompanion.ai.VectorStoreService;
import com.studycompanion.material.dto.MaterialResponse;
import com.studycompanion.material.entity.Material;
import com.studycompanion.material.entity.MaterialStatus;
import com.studycompanion.material.processing.MaterialProcessingWorker;
import com.studycompanion.material.repository.DocumentChunkRepository;
import com.studycompanion.material.repository.MaterialRepository;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final ProjectRepository projectRepository;
    private final MaterialProcessingWorker materialProcessingWorker;
    private final DocumentChunkRepository documentChunkRepository;
    private final VectorStoreService vectorStoreService;

    private final Path uploadDirectory =
            Paths.get("uploads");

    public MaterialService(
            MaterialRepository materialRepository,
            ProjectRepository projectRepository,
            MaterialProcessingWorker materialProcessingWorker,
            DocumentChunkRepository documentChunkRepository,
            VectorStoreService vectorStoreService
    ) {
        this.materialRepository = materialRepository;
        this.projectRepository = projectRepository;
        this.materialProcessingWorker = materialProcessingWorker;
        this.documentChunkRepository = documentChunkRepository;
        this.vectorStoreService = vectorStoreService;
    }

    public MaterialResponse uploadMaterial(
            Long userId,
            Long projectId,
            MultipartFile file
    ) {

        // 1. Validate project ownership
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Project not found")
                );

        if (!project.getSpace().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }

        // 2. Validate file
        validatePdf(file);

        try {

            // 3. Create uploads directory
            Files.createDirectories(uploadDirectory);

            // 4. Generate unique filename
            String storedFileName =
                    UUID.randomUUID() + ".pdf";

            Path filePath =
                    uploadDirectory.resolve(storedFileName);

            // 5. Store file
            Files.copy(file.getInputStream(), filePath);

            // 6. Create material record
            Material material = Material.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(filePath.toString())
                    .status(MaterialStatus.QUEUED)
                    .project(project)
                    .build();

            Material savedMaterial =
                    materialRepository.save(material);

            materialProcessingWorker.processAsync(
                    savedMaterial.getId()
            );

            return toResponse(savedMaterial);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store uploaded file",
                    e
            );
        }
    }

    public List<MaterialResponse> getProjectMaterials(
            Long userId,
            Long projectId
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Project not found")
                );

        if (!project.getSpace().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }

        return materialRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteMaterial(Long userId, Long projectId, Long materialId) {

        // 1. Find material
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Material not found")
                );

        // 2. Verify material belongs to requested project
        if (!material.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException(
                    "Material does not belong to this project"
            );
        }

        // 3. Verify project ownership
        Project project = material.getProject();

        if (!project.getSpace().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }

        // 4. Delete vector embeddings
        vectorStoreService.deleteByMaterialId(materialId);

        // 5. Delete document chunks
        documentChunkRepository.deleteByMaterialId(materialId);

        // 6. Delete physical PDF
        try {

            Path filePath = Paths.get(material.getStoragePath());

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete material file",
                    e
            );
        }

        // 7. Delete material record
        materialRepository.delete(material);
    }

    private void validatePdf(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File is required"
            );
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException(
                    "Only PDF files are supported"
            );
        }

        if (!file.getOriginalFilename()
                .toLowerCase()
                .endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF files are supported"
            );
        }
    }

    private MaterialResponse toResponse(Material material) {

        return new MaterialResponse(
                material.getId(),
                material.getProject().getId(),
                material.getFileName(),
                material.getFileType(),
                material.getFileSize(),
                material.getStatus(),
                material.getErrorMessage()
        );
    }
}