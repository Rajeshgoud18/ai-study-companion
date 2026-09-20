package com.studycompanion.quiz.dto;

import java.util.List;

public record QuizGenerationResponse(
        Long quizId,
        Long projectId,
        Integer totalQuestions,
        List<GeneratedQuestion> questions
) {

    public record GeneratedQuestion(
            String concept,
            String question,
            List<String> options,
            String correctAnswer,
            Integer difficulty
    ) {
    }
}