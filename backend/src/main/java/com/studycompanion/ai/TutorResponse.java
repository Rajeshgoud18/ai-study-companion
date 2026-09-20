package com.studycompanion.ai;

import java.util.List;

public record TutorResponse(
        String answer,
        List<Citation> citations
) {

    public record Citation(
            String fileName,
            Integer pageNumber
    ) {}
}