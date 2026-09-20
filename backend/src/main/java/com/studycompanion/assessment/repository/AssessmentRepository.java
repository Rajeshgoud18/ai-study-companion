package com.studycompanion.assessment.repository;

import com.studycompanion.assessment.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository
        extends JpaRepository<Assessment, Long> {

    List<Assessment> findByUserIdAndProjectIdOrderByCreatedAtDesc(
            Long userId,
            Long projectId
    );
}