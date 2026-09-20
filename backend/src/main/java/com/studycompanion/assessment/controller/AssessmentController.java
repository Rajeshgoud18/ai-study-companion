package com.studycompanion.assessment.controller;

import com.studycompanion.assessment.entity.Assessment;
import com.studycompanion.assessment.dto.AssessmentEvaluationResponse;
import com.studycompanion.assessment.dto.AssessmentRequest;
import com.studycompanion.assessment.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public AssessmentEvaluationResponse evaluate(
            @RequestParam Long userId,
            @RequestParam Long projectId,
            @Valid @RequestBody AssessmentRequest request
    ) {

        Assessment assessment = assessmentService.evaluate(
                userId,
                projectId,
                request
        );

        return new AssessmentEvaluationResponse(
                assessment.getUnderstandingScore(),
                assessment.getAccuracyScore(),
                assessment.getRelevanceScore(),
                assessment.getReasoningScore(),
                assessment.getScore(),
                assessment.getMissingConcepts() == null
                        ? java.util.List.of()
                        : java.util.Arrays.asList(
                        assessment.getMissingConcepts().split(", ")
                ),
                assessment.getFeedback()
        );
    }
}