package com.studycompanion.material.processing;

import com.studycompanion.ai.VectorStoreService;
import com.studycompanion.material.entity.DocumentChunk;
import com.studycompanion.material.entity.Material;
import com.studycompanion.material.entity.MaterialStatus;
import com.studycompanion.material.repository.DocumentChunkRepository;
import com.studycompanion.material.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.studycompanion.concept.service.ConceptExtractionWorker;

import java.nio.file.Path;
import java.util.List;

@Service
public class MaterialProcessor {

    private final MaterialRepository materialRepository;
    private final DocumentChunkRepository documentChunkRepository;
    private final PdfTextExtractor pdfTextExtractor;
    private final TextChunker textChunker;
    private final VectorStoreService vectorStoreService;
    private final ConceptExtractionWorker conceptExtractionWorker;

    public MaterialProcessor(
            MaterialRepository materialRepository,
            DocumentChunkRepository documentChunkRepository,
            PdfTextExtractor pdfTextExtractor,
            TextChunker textChunker,
            VectorStoreService vectorStoreService,
            ConceptExtractionWorker conceptExtractionWorker
    ) {
        this.materialRepository = materialRepository;
        this.documentChunkRepository = documentChunkRepository;
        this.pdfTextExtractor = pdfTextExtractor;
        this.textChunker = textChunker;
        this.vectorStoreService = vectorStoreService;
        this.conceptExtractionWorker = conceptExtractionWorker;
    }

    @Transactional
    public void process(Material material) {

        try {

            // 1. Mark as processing
            material.setStatus(MaterialStatus.PROCESSING);
            material.setErrorMessage(null);
            materialRepository.save(material);

            // 2. Extract PDF text
            List<ExtractedPage> pages =
                    pdfTextExtractor.extractPages(
                            Path.of(material.getStoragePath())
                    );

            // 3. Create chunks
            List<ChunkedText> chunks =
                    textChunker.chunk(pages);

            if (chunks.isEmpty()) {
                throw new IllegalArgumentException(
                        "No readable text found in PDF"
                );
            }

            // 4. Save chunks and generate embeddings
            for (ChunkedText chunkedText : chunks) {

                DocumentChunk chunk = DocumentChunk.builder()
                        .content(chunkedText.content())
                        .chunkIndex(chunkedText.chunkIndex())
                        .pageNumber(chunkedText.pageNumber())
                        .material(material)
                        .build();

                documentChunkRepository.save(chunk);

                vectorStoreService.addDocument(
                        chunkedText.content(),
                        material.getProject().getId(),
                        material.getId(),
                        chunkedText.pageNumber(),
                        material.getFileName()
                );
            }


            // 5. Mark material as ready
            material.setStatus(MaterialStatus.READY);
            materialRepository.save(material);

// 6. Extract concepts in background
            conceptExtractionWorker.extractConceptsAsync(
                    material.getProject().getId(),
                    material.getId()
            );

        } catch (Exception e) {

            material.setStatus(MaterialStatus.FAILED);
            material.setErrorMessage(
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Unknown processing error"
            );

            materialRepository.save(material);

            throw e;
        }
    }
}