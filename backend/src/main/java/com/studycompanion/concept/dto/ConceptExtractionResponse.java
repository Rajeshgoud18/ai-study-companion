package com.studycompanion.concept.dto;

import java.util.List;

public record ConceptExtractionResponse(
        List<ConceptItem> concepts
) {

    public record ConceptItem(
            String name,
            String description
    ) {}
}