package com.studycompanion.admin.dto;

public record AIModelUsageResponse(
        String provider,
        String model,
        long requests,
        long inputTokens,
        long outputTokens,
        long totalTokens,
        double estimatedCost
) {
}