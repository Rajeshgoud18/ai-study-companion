package com.studycompanion.admin.dto;

public record AIUsageSummaryResponse(
        long totalRequests,
        long totalInputTokens,
        long totalOutputTokens,
        long totalTokens,
        double estimatedCost
) {
}