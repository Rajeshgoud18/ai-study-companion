package com.studycompanion.concept.service;

import com.studycompanion.concept.dto.ConceptExtractionResponse;
import com.studycompanion.concept.entity.Concept;
import com.studycompanion.concept.repository.ConceptRepository;
import com.studycompanion.material.entity.DocumentChunk;
import com.studycompanion.material.repository.DocumentChunkRepository;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;
import com.studycompanion.ai.service.AIUsageService;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.metadata.Usage;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConceptService {

    private final ChatClient chatClient;
    private final DocumentChunkRepository documentChunkRepository;
    private final ProjectRepository projectRepository;
    private final ConceptRepository conceptRepository;
    private final ObjectMapper objectMapper;
    private final AIUsageService aiUsageService;

    public ConceptService(
            ChatClient chatClient,
            DocumentChunkRepository documentChunkRepository,
            ProjectRepository projectRepository,
            ConceptRepository conceptRepository,
            ObjectMapper objectMapper,
            AIUsageService aiUsageService) {

        this.chatClient = chatClient;
        this.documentChunkRepository = documentChunkRepository;
        this.projectRepository = projectRepository;
        this.conceptRepository = conceptRepository;
        this.objectMapper = objectMapper;
        this.aiUsageService = aiUsageService;
    }

    public ConceptExtractionResponse extractConcepts(
            Long projectId,
            Long materialId) {

        // 1. Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        // 2. Get chunks ONLY for this material
        List<DocumentChunk> chunks =
                documentChunkRepository.findByMaterialId(materialId);

        if (chunks.isEmpty()) {
            throw new RuntimeException(
                    "No document content found for this material"
            );
        }

        /*
         * 3. Use only a representative portion of the document
         *
         * Concept extraction does not need to send every chunk
         * to the LLM. RAG already stores the complete document
         * for later retrieval.
         */
        int maxChunksForConceptExtraction =
                Math.min(chunks.size(), 10);

        List<DocumentChunk> conceptChunks =
                chunks.subList(0, maxChunksForConceptExtraction);

        System.out.println(
                "Extracting concepts from "
                        + conceptChunks.size()
                        + " chunks for material: "
                        + materialId
        );

        // 4. Build compact context
        StringBuilder context = new StringBuilder();

        for (DocumentChunk chunk : conceptChunks) {

            context.append("Page ")
                    .append(chunk.getPageNumber())
                    .append(":\n");

            String content = chunk.getContent();

            // Keep the prompt reasonably small
            if (content.length() > 400) {
                content = content.substring(0, 400);
            }

            context.append(content)
                    .append("\n\n");
        }

        // 5. Build prompt
        String prompt = """
        Extract 3 to 5 important learning concepts from the study material.

        Use only the provided material.

        Return ONLY a JSON object in exactly this format:

        {"concepts":[{"name":"Concept 1","description":"Short description"}]}

        Rules:
        - Valid JSON only
        - Double quotes only
        - No markdown
        - No ``` 
        - No explanation
        - No trailing commas
        - Maximum 5 concepts

        Study material:
        %s
        """.formatted(context);

        // 6. Single AI request
        String rawResponse =
                chatClient.prompt()
                        .user(prompt)
                        .call()
                        .content();

        System.out.println("Concept extraction AI response:");
        System.out.println(rawResponse);

        ConceptExtractionResponse response;

        try {
            response = objectMapper.readValue(
                    rawResponse,
                    ConceptExtractionResponse.class
            );
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse concept extraction response from AI",
                    e
            );
        }

        List<ConceptExtractionResponse.ConceptItem> allConcepts =
                new ArrayList<>();

        if (response != null &&
                response.concepts() != null) {

            allConcepts.addAll(response.concepts());
        }

        // 7. Remove duplicate concepts
        List<ConceptExtractionResponse.ConceptItem> uniqueConcepts =
                new ArrayList<>();

        for (ConceptExtractionResponse.ConceptItem concept
                : allConcepts) {

            if (concept.name() == null ||
                    concept.name().isBlank()) {
                continue;
            }

            boolean duplicate = uniqueConcepts.stream()
                    .anyMatch(existing ->
                            existing.name()
                                    .equalsIgnoreCase(
                                            concept.name()
                                    ));

            if (!duplicate) {
                uniqueConcepts.add(concept);
            }
        }

        // 8. Save concepts
        for (ConceptExtractionResponse.ConceptItem item
                : uniqueConcepts) {

            boolean alreadyExists =
                    conceptRepository
                            .existsByProjectIdAndNameIgnoreCase(
                                    projectId,
                                    item.name()
                            );

            if (!alreadyExists) {

                Concept concept = Concept.builder()
                        .project(project)
                        .name(item.name())
                        .description(item.description())
                        .build();

                conceptRepository.save(concept);
            }
        }

        System.out.println(
                "Concept extraction completed. Concepts found: "
                        + uniqueConcepts.size()
        );

        // 9. Return final result
        return new ConceptExtractionResponse(
                uniqueConcepts
        );
    }
}