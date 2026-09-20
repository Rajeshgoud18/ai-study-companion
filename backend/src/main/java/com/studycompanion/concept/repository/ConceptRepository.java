package com.studycompanion.concept.repository;

import com.studycompanion.concept.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConceptRepository
        extends JpaRepository<Concept, Long> {

    List<Concept> findByProjectId(Long projectId);

    boolean existsByProjectIdAndNameIgnoreCase(
            Long projectId,
            String name
    );

    Optional<Concept> findByProjectIdAndNameIgnoreCase(
            Long projectId,
            String name
    );

    Optional<Concept> findByIdAndProjectId(
            Long conceptId,
            Long projectId
    );
}