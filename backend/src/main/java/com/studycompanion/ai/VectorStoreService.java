package com.studycompanion.ai;

import com.studycompanion.material.entity.DocumentChunk;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VectorStoreService {

    private final VectorStore vectorStore;

    public VectorStoreService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void addDocument(String content,
                            Long projectId,
                            Long materialId,
                            Integer pageNumber,
                            String fileName) {

        Document document = Document.builder()
                .text(content)
                .metadata("projectId", projectId)
                .metadata("materialId", materialId)
                .metadata("pageNumber", pageNumber)
                .metadata("fileName", fileName)
                .build();

        vectorStore.add(List.of(document));
    }

    public void reindexMaterial(Long materialId, Long projectId, String fileName,
                                List<DocumentChunk> chunks) {

        List<Document> documents = chunks.stream()
                .map(chunk -> Document.builder()
                        .text(chunk.getContent())
                        .metadata("projectId", projectId)
                        .metadata("materialId", materialId)
                        .metadata("pageNumber", chunk.getPageNumber())
                        .metadata("fileName", fileName)
                        .build())
                .toList();

        int batchSize = 20;

        for (int i = 0; i < documents.size(); i += batchSize) {

            int end = Math.min(i + batchSize, documents.size());

            List<Document> batch = documents.subList(i, end);

            vectorStore.add(batch);

            System.out.println(
                    "Indexed " + end + " / " + documents.size() + " chunks"
            );
        }
    }

    public void deleteByMaterialId(Long materialId) {

        String filter = "materialId == " + materialId;

        vectorStore.delete(filter);
    }
}