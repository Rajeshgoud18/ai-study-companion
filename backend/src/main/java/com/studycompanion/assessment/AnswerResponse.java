package com.studycompanion.assessment;

public record AnswerResponse(
        Long questionId,
        String answer,
        boolean correct,
        String correctAnswer
) {
}