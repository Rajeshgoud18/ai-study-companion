package com.studycompanion.quiz.repository;

import com.studycompanion.quiz.entity.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizAnswerRepository
        extends JpaRepository<QuizAnswer, Long> {

    List<QuizAnswer> findByQuizId(Long quizId);

    Optional<QuizAnswer> findByQuizIdAndQuestionId(
            Long quizId,
            Long questionId
    );

    List<QuizAnswer> findByUserIdAndQuizId(
            Long userId,
            Long quizId
    );
}