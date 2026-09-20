package com.studycompanion.material.repository;

import com.studycompanion.material.entity.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentChunkRepository
        extends JpaRepository<DocumentChunk, Long> {

    List<DocumentChunk> findByMaterialProjectId(Long projectId);

    List<DocumentChunk> findByMaterialId(Long materialId);

    void deleteByMaterialId(Long materialId);
}