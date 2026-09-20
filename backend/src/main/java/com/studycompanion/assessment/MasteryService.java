package com.studycompanion.assessment;

import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventService;
import com.studycompanion.assessment.entity.Assessment;
import com.studycompanion.concept.entity.Concept;
import com.studycompanion.concept.entity.ConceptMastery;
import com.studycompanion.concept.repository.ConceptMasteryRepository;
import com.studycompanion.quiz.repository.QuizAnswerRepository;
import com.studycompanion.quiz.entity.Quiz;
import com.studycompanion.quiz.entity.QuizAnswer;
import com.studycompanion.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class MasteryService {

    private final QuizAnswerRepository quizAnswerRepository;
    private final ConceptMasteryRepository conceptMasteryRepository;
    private final LearningEventService learningEventService;

    public MasteryService(
            QuizAnswerRepository quizAnswerRepository,
            ConceptMasteryRepository conceptMasteryRepository,
            LearningEventService learningEventService
    ) {
        this.quizAnswerRepository = quizAnswerRepository;
        this.conceptMasteryRepository = conceptMasteryRepository;
        this.learningEventService = learningEventService;
    }

    @Transactional
    public void updateMasteryFromQuiz(Quiz quiz) {

        List<QuizAnswer> answers =
                quizAnswerRepository.findByQuizId(quiz.getId());

        if (answers.isEmpty()) {
            return;
        }

        User user = quiz.getUser();

        // Group answers by concept
        Map<Long, List<QuizAnswer>> answersByConcept =
                new HashMap<>();

        for (QuizAnswer answer : answers) {

            Long conceptId =
                    answer.getQuestion()
                            .getConcept()
                            .getId();

            answersByConcept
                    .computeIfAbsent(
                            conceptId,
                            key -> new ArrayList<>()
                    )
                    .add(answer);
        }

        // Update mastery for each concept
        for (List<QuizAnswer> conceptAnswers
                : answersByConcept.values()) {

            Concept concept =
                    conceptAnswers.get(0)
                            .getQuestion()
                            .getConcept();

            int questionsAnswered =
                    conceptAnswers.size();

            int questionsCorrect = 0;

            for (QuizAnswer answer : conceptAnswers) {
                if (Boolean.TRUE.equals(answer.getCorrect())) {
                    questionsCorrect++;
                }
            }

            // Performance in this quiz
            double quizPerformance =
                    (double) questionsCorrect
                            / questionsAnswered;

            ConceptMastery mastery =
                    conceptMasteryRepository
                            .findByUserIdAndConceptId(
                                    user.getId(),
                                    concept.getId()
                            )
                            .orElse(null);

            if (mastery == null) {

                // First assessment for this concept
                mastery = ConceptMastery.builder()
                        .user(user)
                        .concept(concept)
                        .masteryScore(quizPerformance)
                        .questionsAnswered(questionsAnswered)
                        .questionsCorrect(questionsCorrect)
                        .build();

            } else {

                // Previous mastery has more weight
                double oldMastery =
                        mastery.getMasteryScore();

                double newMastery =
                        (oldMastery * 0.7)
                                + (quizPerformance * 0.3);

                mastery.setMasteryScore(newMastery);

                mastery.setQuestionsAnswered(
                        mastery.getQuestionsAnswered()
                                + questionsAnswered
                );

                mastery.setQuestionsCorrect(
                        mastery.getQuestionsCorrect()
                                + questionsCorrect
                );
            }

            conceptMasteryRepository.save(mastery);

            learningEventService.record(
                    user.getId(),
                    quiz.getProject().getId(),
                    LearningEvent.EventType.MASTERY_UPDATED,
                    "Mastery updated for concept: "
                            + concept.getName()
                            + ", new mastery: "
                            + mastery.getMasteryScore()
            );
        }
    }

    @Transactional
    public void updateMasteryFromAssessment(Assessment assessment) {

        User user = assessment.getUser();
        Concept concept = assessment.getConcept();

        double assessmentScore = assessment.getScore();

        ConceptMastery mastery = conceptMasteryRepository
                .findByUserIdAndConceptId(
                        user.getId(),
                        concept.getId()
                )
                .orElseGet(() -> ConceptMastery.builder()
                        .user(user)
                        .concept(concept)
                        .masteryScore(0.0)
                        .questionsAnswered(0)
                        .questionsCorrect(0)
                        .build());

        double oldMastery = mastery.getMasteryScore();

        // Assessment contributes 40%,
        // previous mastery contributes 60%.
        double newMastery =
                (oldMastery * 0.6) +
                        (assessmentScore * 0.4);

        mastery.setMasteryScore(newMastery);

        conceptMasteryRepository.save(mastery);

        learningEventService.record(
                user.getId(),
                assessment.getProject().getId(),
                LearningEvent.EventType.MASTERY_UPDATED,
                "Mastery updated for concept: "
                        + concept.getName()
                        + ", new mastery: "
                        + mastery.getMasteryScore()
        );
    }
}