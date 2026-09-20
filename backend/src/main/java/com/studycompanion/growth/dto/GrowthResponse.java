package com.studycompanion.growth.dto;

import java.util.List;

public record GrowthResponse(
        Double overallMastery,
        String overallStatus,
        List<ConceptGrowth> concepts
) {

    public record ConceptGrowth(
            Long conceptId,
            String conceptName,
            Double mastery,
            String status
    ) {
    }
}