package com.studycompanion.assessment.repository;

import com.studycompanion.assessment.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizId(Long quizId);

    List<Question> findByQuizIdAndConceptId(
            Long quizId,
            Long conceptId
    );
}