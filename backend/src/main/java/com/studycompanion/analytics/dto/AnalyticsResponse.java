package com.studycompanion.analytics.dto;

import java.util.List;

public record AnalyticsResponse(
        Long userId,
        Long projectId,
        Integer totalTutorInteractions,
        Integer totalQuizzes,
        Integer completedQuizzes,
        Integer totalAssessments,
        Double overallMastery,
        Integer totalLearningEvents,
        List<ConceptAnalytics> concepts
) {

    public record ConceptAnalytics(
            Long conceptId,
            String conceptName,
            Double masteryScore
    ) {}
}