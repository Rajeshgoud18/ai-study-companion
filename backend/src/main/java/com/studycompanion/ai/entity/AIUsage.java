package com.studycompanion.ai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_usage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String provider;

    private String model;

    private String operation;

    private Long inputTokens;

    private Long outputTokens;

    private Long totalTokens;

    private Double estimatedCost;

    private Long userId;

    private LocalDateTime createdAt;
}