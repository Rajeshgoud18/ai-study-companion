package com.studycompanion.concept.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ConceptExtractionWorker {

    private final ConceptService conceptService;

    public ConceptExtractionWorker(ConceptService conceptService) {
        this.conceptService = conceptService;
    }

    @Async
    public void extractConceptsAsync(
            Long projectId,
            Long materialId) {

        try {

            System.out.println(
                    "Starting background concept extraction for material: "
                            + materialId
            );

            conceptService.extractConcepts(
                    projectId,
                    materialId
            );

            System.out.println(
                    "Background concept extraction completed for material: "
                            + materialId
            );

        } catch (Exception e) {

            System.err.println(
                    "Background concept extraction failed for material: "
                            + materialId
            );

            e.printStackTrace();
        }
    }
}