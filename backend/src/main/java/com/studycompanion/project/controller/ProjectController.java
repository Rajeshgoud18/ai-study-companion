package com.studycompanion.project.controller;

import com.studycompanion.project.dto.CreateProjectRequest;
import com.studycompanion.project.dto.ProjectResponse;
import com.studycompanion.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/api/spaces/{spaceId}/projects")
    public ResponseEntity<ProjectResponse> createProject(
            @PathVariable Long spaceId,
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        ProjectResponse response = projectService.createProject(
                userId,
                spaceId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/api/spaces/{spaceId}/projects")
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @PathVariable Long spaceId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        return ResponseEntity.ok(
                projectService.getProjects(userId, spaceId)
        );
    }

    @GetMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        return ResponseEntity.ok(
                projectService.getProject(userId, projectId)
        );
    }

    @DeleteMapping("/api/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        projectService.deleteProject(userId, projectId);

        return ResponseEntity.noContent().build();
    }
}