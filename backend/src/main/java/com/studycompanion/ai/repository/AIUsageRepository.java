package com.studycompanion.ai.repository;

import com.studycompanion.ai.entity.AIUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AIUsageRepository extends JpaRepository<AIUsage, Long> {

    @Query("""
            SELECT COALESCE(SUM(a.inputTokens), 0)
            FROM AIUsage a
            """)
    Long getTotalInputTokens();

    @Query("""
            SELECT COALESCE(SUM(a.outputTokens), 0)
            FROM AIUsage a
            """)
    Long getTotalOutputTokens();

    @Query("""
            SELECT COALESCE(SUM(a.totalTokens), 0)
            FROM AIUsage a
            """)
    Long getTotalTokens();

    @Query("""
            SELECT COALESCE(SUM(a.estimatedCost), 0)
            FROM AIUsage a
            """)
    Double getTotalEstimatedCost();

    @Query("""
        SELECT
            a.provider,
            a.model,
            COUNT(a),
            COALESCE(SUM(a.inputTokens), 0),
            COALESCE(SUM(a.outputTokens), 0),
            COALESCE(SUM(a.totalTokens), 0),
            COALESCE(SUM(a.estimatedCost), 0)
        FROM AIUsage a
        GROUP BY a.provider, a.model
        ORDER BY SUM(a.totalTokens) DESC
        """)
    List<Object[]> getUsageByModel();
}