package com.studycompanion.concept.repository;

import com.studycompanion.concept.entity.ConceptMastery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConceptMasteryRepository
        extends JpaRepository<ConceptMastery, Long> {

    Optional<ConceptMastery> findByUserIdAndConceptId(
            Long userId,
            Long conceptId
    );

    List<ConceptMastery> findByUserId(Long userId);

    List<ConceptMastery> findByUserIdAndConceptProjectId(
            Long userId,
            Long projectId
    );

}