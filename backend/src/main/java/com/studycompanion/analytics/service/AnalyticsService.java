package com.studycompanion.analytics.service;

import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventRepository;
import com.studycompanion.analytics.dto.AnalyticsResponse;
import com.studycompanion.assessment.repository.AssessmentRepository;
import com.studycompanion.concept.entity.ConceptMastery;
import com.studycompanion.concept.repository.ConceptMasteryRepository;
import com.studycompanion.quiz.repository.QuizRepository;
import com.studycompanion.quiz.entity.Quiz;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final LearningEventRepository learningEventRepository;
    private final ConceptMasteryRepository conceptMasteryRepository;
    private final QuizRepository quizRepository;
    private final AssessmentRepository assessmentRepository;

    public AnalyticsService(
            LearningEventRepository learningEventRepository,
            ConceptMasteryRepository conceptMasteryRepository,
            QuizRepository quizRepository,
            AssessmentRepository assessmentRepository
    ) {
        this.learningEventRepository = learningEventRepository;
        this.conceptMasteryRepository = conceptMasteryRepository;
        this.quizRepository = quizRepository;
        this.assessmentRepository = assessmentRepository;
    }

    public AnalyticsResponse getProjectAnalytics(
            Long userId,
            Long projectId
    ) {

        // Learning events
        List<LearningEvent> events =
                learningEventRepository
                        .findByUserIdAndProjectIdOrderByCreatedAtDesc(
                                userId,
                                projectId
                        );

        int tutorInteractions = (int) events.stream()
                .filter(event ->
                        event.getEventType()
                                == LearningEvent.EventType.TUTOR_INTERACTION)
                .count();

        int totalLearningEvents = events.size();

        // Quizzes
        List<Quiz> quizzes =
                quizRepository.findByUserIdAndProjectId(
                        userId,
                        projectId
                );

        int totalQuizzes = quizzes.size();

        int completedQuizzes = (int) quizzes.stream()
                .filter(quiz ->
                        quiz.getStatus()
                                == Quiz.Status.COMPLETED)
                .count();

        // Assessments
        int totalAssessments =
                assessmentRepository
                        .findByUserIdAndProjectIdOrderByCreatedAtDesc(
                                userId,
                                projectId
                        )
                        .size();

        // Concept mastery
        List<ConceptMastery> masteryList =
                conceptMasteryRepository
                        .findByUserIdAndConceptProjectId(
                                userId,
                                projectId
                        );

        double overallMastery = masteryList.isEmpty()
                ? 0.0
                : masteryList.stream()
                .mapToDouble(ConceptMastery::getMasteryScore)
                .average()
                .orElse(0.0);

        List<AnalyticsResponse.ConceptAnalytics> concepts =
                masteryList.stream()
                        .map(mastery ->
                                new AnalyticsResponse.ConceptAnalytics(
                                        mastery.getConcept().getId(),
                                        mastery.getConcept().getName(),
                                        mastery.getMasteryScore()
                                )
                        )
                        .toList();

        return new AnalyticsResponse(
                userId,
                projectId,
                tutorInteractions,
                totalQuizzes,
                completedQuizzes,
                totalAssessments,
                overallMastery,
                totalLearningEvents,
                concepts
        );
    }
}