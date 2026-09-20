package com.studycompanion.admin.dto;

public record AdminProjectDetailResponse(
        Long projectId,
        String projectName,
        Long spaceId,
        String spaceName,
        Long userId,
        String userName,
        String userEmail
) {
    public static record AdminOverviewResponse(
            Long totalUsers,
            Long totalSpaces,
            Long totalProjects,
            Long totalLearningEvents
    ) {}
}