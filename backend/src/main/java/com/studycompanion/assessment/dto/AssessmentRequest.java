package com.studycompanion.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssessmentRequest(

        @NotNull
        Long conceptId,

        @NotBlank
        String question,

        @NotBlank
        String answer

) {
}