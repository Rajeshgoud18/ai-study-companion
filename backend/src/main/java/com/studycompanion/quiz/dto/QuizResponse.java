package com.studycompanion.quiz.dto;

import java.util.List;

public record QuizResponse(
        Long quizId,
        Long projectId,
        Integer totalQuestions,
        String status,
        List<QuestionResponse> questions
) {

    public record QuestionResponse(
            Long questionId,
            Long conceptId,
            String conceptName,
            String questionText,
            List<String> options,
            Integer difficulty
    ) {
    }
}