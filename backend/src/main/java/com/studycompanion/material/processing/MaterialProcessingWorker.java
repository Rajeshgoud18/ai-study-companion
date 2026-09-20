package com.studycompanion.material.processing;

import com.studycompanion.material.entity.Material;
import com.studycompanion.material.repository.MaterialRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MaterialProcessingWorker {

    private final MaterialRepository materialRepository;
    private final MaterialProcessor materialProcessor;

    public MaterialProcessingWorker(
            MaterialRepository materialRepository,
            MaterialProcessor materialProcessor
    ) {
        this.materialRepository = materialRepository;
        this.materialProcessor = materialProcessor;
    }

    @Async
    public void processAsync(Long materialId) {

        Material material = materialRepository.findById(materialId)
                .orElse(null);

        if (material == null) {
            System.out.println(
                    "Material " + materialId +
                            " was deleted before processing started."
            );
            return;
        }

        materialProcessor.process(material);
    }
}