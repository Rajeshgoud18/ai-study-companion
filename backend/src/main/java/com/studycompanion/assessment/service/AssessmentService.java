package com.studycompanion.assessment.service;

import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventService;
import com.studycompanion.concept.entity.Concept;
import com.studycompanion.concept.repository.ConceptRepository;
import com.studycompanion.assessment.MasteryService;
import com.studycompanion.recommendation.service.RecommendationService;
import com.studycompanion.assessment.dto.AssessmentEvaluationResponse;
import com.studycompanion.assessment.dto.AssessmentRequest;
import com.studycompanion.assessment.entity.Assessment;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.studycompanion.assessment.repository.AssessmentRepository;
import com.studycompanion.ai.service.AIUsageService;
import org.springframework.ai.chat.client.ResponseEntity;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.metadata.Usage;

import java.time.LocalDateTime;

@Service
public class AssessmentService {

    private final ChatClient chatClient;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ConceptRepository conceptRepository;
    private final MasteryService masteryService;
    private final AssessmentRepository assessmentRepository;
    private final RecommendationService recommendationService;
    private final LearningEventService learningEventService;
    private final AIUsageService aiUsageService;

    public AssessmentService(
            ChatClient.Builder chatClientBuilder,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ConceptRepository conceptRepository,
            MasteryService masteryService,
            AssessmentRepository assessmentRepository,
            RecommendationService recommendationService,
            LearningEventService learningEventService,
            AIUsageService aiUsageService
    ) {
        this.chatClient = chatClientBuilder.build();
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.conceptRepository = conceptRepository;
        this.assessmentRepository = assessmentRepository;
        this.masteryService=masteryService;
        this.recommendationService = recommendationService;
        this.learningEventService = learningEventService;
        this.aiUsageService = aiUsageService;
    }

    @Transactional
    public Assessment evaluate(
            Long userId,
            Long projectId,
            AssessmentRequest request
    ) {

        // 1. Verify user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Verify project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));


        // 3. Verify concept belongs to this project
        Concept concept = conceptRepository
                .findByIdAndProjectId(
                        request.conceptId(),
                        projectId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Concept not found for this project"
                        ));

        if (concept == null) {
            concept = conceptRepository.findById(
                    request.conceptId()
            ).orElseThrow(() ->
                    new RuntimeException("Concept not found"));
        }

        if (!concept.getProject().getId().equals(projectId)) {
            throw new RuntimeException(
                    "Concept does not belong to this project"
            );
        }

        // 4. Build evaluation prompt
        String prompt = """
                You are an educational assessment evaluator.

                Evaluate the learner's answer to the question.

                Question:
                %s

                Learner's answer:
                %s

                Concept:
                %s

                Evaluate ONLY the learner's answer.

                Give scores from 0.0 to 1.0 for:

                - understandingScore:
                  How well the learner demonstrates understanding.

                - accuracyScore:
                  How factually correct the answer is.

                - relevanceScore:
                  How directly the answer addresses the question.

                - reasoningScore:
                  How clearly the learner explains reasoning or relationships.

                - overallScore:
                  Overall quality of the answer.

                Also provide:
                - missingConcepts: important concepts missing from the answer.
                - feedback: concise educational feedback.

                Rules:
                - Do not reward information that is unrelated to the question.
                - Do not invent missing concepts.
                - Use only information supported by the question and concept.
                - Scores must be between 0.0 and 1.0.
                - Keep feedback constructive and concise.
                """.formatted(
                request.question(),
                request.answer(),
                concept.getName()
        );

        // 5. Ask Gemini for structured output
        ResponseEntity<ChatResponse, AssessmentEvaluationResponse> result =
                chatClient.prompt()
                        .user(prompt)
                        .call()
                        .responseEntity(AssessmentEvaluationResponse.class);

        AssessmentEvaluationResponse evaluation = result.entity();

        ChatResponse chatResponse = result.response();

        Usage usage = chatResponse.getMetadata().getUsage();

        aiUsageService.recordUsage(
                "OPENROUTER",
                chatResponse.getMetadata().getModel(),
                "ASSESSMENT",
                usage.getPromptTokens().longValue(),
                usage.getCompletionTokens().longValue(),
                userId
        );

        if (evaluation == null) {
            throw new RuntimeException(
                    "Failed to evaluate assessment"
            );
        }

        // 6. Save assessment
        Assessment assessment = Assessment.builder()
                .user(user)
                .project(project)
                .concept(concept)
                .question(request.question())
                .answer(request.answer())
                .score(evaluation.overallScore())
                .understandingScore(
                        evaluation.understandingScore()
                )
                .accuracyScore(
                        evaluation.accuracyScore()
                )
                .relevanceScore(
                        evaluation.relevanceScore()
                )
                .reasoningScore(
                        evaluation.reasoningScore()
                )
                .missingConcepts(
                        evaluation.missingConcepts() == null
                                ? ""
                                : String.join(
                                ", ",
                                evaluation.missingConcepts()
                        )
                )
                .feedback(evaluation.feedback())
                .createdAt(LocalDateTime.now())
                .build();

        Assessment savedAssessment =
                assessmentRepository.save(assessment);

        masteryService.updateMasteryFromAssessment(savedAssessment);

        recommendationService.generateRecommendation(
                userId,
                projectId
        );

        learningEventService.record(
                userId,
                projectId,
                LearningEvent.EventType.ASSESSMENT_COMPLETED,
                "Assessment completed for concept: "
                        + savedAssessment.getConcept().getName()
                        + ", score: "
                        + savedAssessment.getScore()
        );

        return savedAssessment;
    }
}