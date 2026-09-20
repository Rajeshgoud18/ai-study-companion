package com.studycompanion.admin.controller;

import com.studycompanion.admin.dto.*;
import com.studycompanion.admin.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.studycompanion.ai.service.AIUsageService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AIUsageService aiUsageService;

    public AdminController(AdminService adminService, AIUsageService aiUsageService) {
        this.adminService = adminService;
        this.aiUsageService = aiUsageService;
    }

    @GetMapping("/overview")
    public AdminProjectDetailResponse.AdminOverviewResponse getOverview() {
        return adminService.getOverview();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers() {
        return adminService.getUsers();
    }

    @GetMapping("/users/{userId}/activity")
    public List<AdminActivityResponse> getUserActivity(
            @PathVariable Long userId
    ) {
        return adminService.getUserActivity(userId);
    }

    @GetMapping("/users/{userId}/projects")
    public List<AdminProjectResponse> getUserProjects(
            @PathVariable Long userId) {

        return adminService.getUserProjects(userId);
    }

    @GetMapping("/ai/usage")
    public AIUsageSummaryResponse getAIUsage() {
        return aiUsageService.getUsageSummary();
    }

    @GetMapping("/projects/{projectId}")
    public AdminProjectDetailResponse getProjectDetails(
            @PathVariable Long projectId) {

        return adminService.getProjectDetails(projectId);
    }

    @GetMapping("/ai/models")
    public List<AIModelUsageResponse> getAIUsageByModel() {
        return aiUsageService.getUsageByModel();
    }
}