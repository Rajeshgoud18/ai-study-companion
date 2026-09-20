package com.studycompanion.assessment.repository;

import com.studycompanion.recommendation.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository
        extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByUserIdAndProjectIdOrderByCreatedAtDesc(
            Long userId,
            Long projectId
    );
}