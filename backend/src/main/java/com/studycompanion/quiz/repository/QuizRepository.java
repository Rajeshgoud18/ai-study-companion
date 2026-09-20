package com.studycompanion.quiz.repository;

import com.studycompanion.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByUserIdAndProjectId(
            Long userId,
            Long projectId
    );

    Optional<Quiz> findByIdAndUserIdAndProjectId(
            Long quizId,
            Long userId,
            Long projectId
    );
}