package com.studycompanion.assessment.dto;

import java.util.List;

public record AssessmentEvaluationResponse(

        Double understandingScore,

        Double accuracyScore,

        Double relevanceScore,

        Double reasoningScore,

        Double overallScore,

        List<String> missingConcepts,

        String feedback

) {
}