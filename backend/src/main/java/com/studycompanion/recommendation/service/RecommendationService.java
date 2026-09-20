package com.studycompanion.recommendation.service;

import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventService;
import com.studycompanion.concept.entity.Concept;
import com.studycompanion.concept.entity.ConceptMastery;
import com.studycompanion.concept.repository.ConceptMasteryRepository;
import com.studycompanion.assessment.repository.RecommendationRepository;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.recommendation.entity.Recommendation;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final ConceptMasteryRepository conceptMasteryRepository;
    private final RecommendationRepository recommendationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final LearningEventService learningEventService;

    public RecommendationService(
            ConceptMasteryRepository conceptMasteryRepository,
            RecommendationRepository recommendationRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            LearningEventService learningEventService
    ) {
        this.conceptMasteryRepository = conceptMasteryRepository;
        this.recommendationRepository = recommendationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.learningEventService = learningEventService;
    }

    @Transactional
    public Recommendation generateRecommendation(
            Long userId,
            Long projectId
    ) {

        // 1. Verify user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Verify project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        // 3. Get mastery data
        List<ConceptMastery> masteryList =
                conceptMasteryRepository
                        .findByUserIdAndConceptProjectId(
                                userId,
                                projectId
                        );

        if (masteryList.isEmpty()) {
            throw new RuntimeException(
                    "No mastery data available for recommendations"
            );
        }

        // 4. Find weakest concept
        ConceptMastery weakest =
                masteryList.stream()
                        .min(Comparator.comparing(
                                ConceptMastery::getMasteryScore
                        ))
                        .orElseThrow();

        Concept concept = weakest.getConcept();

        double mastery = weakest.getMasteryScore();

        // 5. Determine recommended action
        String action;
        String reason;

        if (mastery < 0.40) {

            action =
                    "Review \"" + concept.getName()
                            + "\" and take another quiz.";

            reason =
                    "Your current mastery for this concept is "
                            + String.format("%.0f", mastery * 100)
                            + "%, so it needs more practice.";

        } else if (mastery < 0.70) {

            action =
                    "Practice \"" + concept.getName()
                            + "\" with a short quiz.";

            reason =
                    "Your mastery is developing, but additional "
                            + "practice could strengthen your understanding.";

        } else {

            action =
                    "Continue learning and challenge yourself "
                            + "with a harder quiz.";

            reason =
                    "Your mastery is strong. A more challenging "
                            + "assessment can help reinforce it.";
        }

        // 6. Save recommendation
        Recommendation recommendation =
                Recommendation.builder()
                        .user(user)
                        .project(project)
                        .concept(concept)
                        .action(action)
                        .reason(reason)
                        .createdAt(LocalDateTime.now())
                        .completed(false)
                        .build();

        Recommendation savedRecommendation =
                recommendationRepository.save(
                        recommendation
                );

        learningEventService.record(
                userId,
                projectId,
                LearningEvent.EventType.RECOMMENDATION_CREATED,
                "Recommendation created for concept: "
                        + concept.getName()
                        + ", mastery: "
                        + mastery
        );

        return savedRecommendation;
    }


}