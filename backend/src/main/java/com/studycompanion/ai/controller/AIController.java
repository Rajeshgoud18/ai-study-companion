package com.studycompanion.ai.controller;

import com.studycompanion.ai.*;
import com.studycompanion.ai.service.AIService;
import com.studycompanion.assessment.*;
import com.studycompanion.concept.dto.ConceptExtractionResponse;
import com.studycompanion.concept.service.ConceptService;
import com.studycompanion.growth.dto.GrowthResponse;
import com.studycompanion.growth.service.GrowthService;
import com.studycompanion.material.repository.DocumentChunkRepository;
import com.studycompanion.quiz.dto.QuizGenerationResponse;
import com.studycompanion.quiz.dto.QuizResponse;
import com.studycompanion.quiz.dto.SubmitAnswerRequest;
import com.studycompanion.quiz.service.QuizService;
import com.studycompanion.recommendation.entity.Recommendation;
import com.studycompanion.recommendation.dto.RecommendationResponse;
import com.studycompanion.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.ai.document.Document;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final VectorSearchService vectorSearchService;
    private final TutorService tutorService;
    private final ConceptService conceptService;
    private final QuizService quizService;
    private final GrowthService growthService;
    private final RecommendationService recommendationService;
    private final DocumentChunkRepository documentChunkRepository;
    private final VectorStoreService vectorStoreService;

    public AIController(
            AIService aiService,
            VectorSearchService vectorSearchService,
            TutorService tutorService,
            ConceptService conceptService,
            QuizService quizService,
            GrowthService growthService,
            RecommendationService recommendationService,
            VectorStoreService vectorStoreService,
            DocumentChunkRepository documentChunkRepository
    ) {

        this.aiService = aiService;
        this.vectorSearchService = vectorSearchService;
        this.tutorService = tutorService;
        this.conceptService = conceptService;
        this.quizService = quizService;
        this.growthService= growthService;
        this.recommendationService=recommendationService;
        this.documentChunkRepository=documentChunkRepository;
        this.vectorStoreService=vectorStoreService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        return aiService.chat(request.message());
    }

    @GetMapping("/search")
    public List<Document> search(
            @RequestParam Long projectId,
            @RequestParam String query) {

        return vectorSearchService.search(query, projectId, 5);
    }

    @PostMapping("/tutor")
    public TutorResponse tutor(
            @RequestParam Long projectId,
            @RequestBody TutorRequest request,
            Authentication authentication) {

        Long userId = (Long) authentication.getDetails();

        return tutorService.ask(
                userId,
                projectId,
                request.question()
        );
    }

    @PostMapping("/concepts/extract")
    public ConceptExtractionResponse extractConcepts(
            @RequestParam Long projectId,
            @RequestParam Long materialId) {

        return conceptService.extractConcepts(
                projectId,
                materialId
        );
    }

    @PostMapping("/quiz/generate")
    public QuizGenerationResponse generateQuiz(
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        return quizService.generateQuiz(projectId, userId);
    }

    @GetMapping("/quiz/{quizId}")
    public QuizResponse getQuiz(
            @PathVariable Long quizId,
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        return quizService.getQuiz(quizId, userId, projectId);
    }

    @PostMapping("/quiz/{quizId}/answer")
    public AnswerResponse submitAnswer(
            @PathVariable Long quizId,
            @RequestParam Long projectId,
            @Valid @RequestBody SubmitAnswerRequest request,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        return quizService.submitAnswer(
                quizId,
                userId,
                projectId,
                request
        );
    }

    @GetMapping("/growth")
    public GrowthResponse getGrowth(
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        return growthService.getGrowth(userId, projectId);
    }

    @PostMapping("/recommendation")
    public RecommendationResponse generateRecommendation(
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        Recommendation recommendation =
                recommendationService.generateRecommendation(
                        userId,
                        projectId
                );

        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getProject().getId(),
                recommendation.getConcept().getId(),
                recommendation.getConcept().getName(),
                recommendation.getAction(),
                recommendation.getReason(),
                recommendation.getCreatedAt(),
                recommendation.getCompleted()
        );
    }


    public record ChatRequest(String message) {}

    public record TutorRequest(String question) {}
}