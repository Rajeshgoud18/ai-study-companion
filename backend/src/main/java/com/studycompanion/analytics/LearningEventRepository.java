package com.studycompanion.analytics;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningEventRepository
        extends JpaRepository<LearningEvent, Long> {

    List<LearningEvent> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<LearningEvent> findByUserIdAndProjectIdOrderByCreatedAtDesc(
            Long userId,
            Long projectId
    );
}