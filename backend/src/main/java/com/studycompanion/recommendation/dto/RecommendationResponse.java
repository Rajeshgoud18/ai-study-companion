package com.studycompanion.recommendation.dto;

import java.time.LocalDateTime;

public record RecommendationResponse(
        Long id,
        Long projectId,
        Long conceptId,
        String conceptName,
        String action,
        String reason,
        LocalDateTime createdAt,
        Boolean completed
) {
}