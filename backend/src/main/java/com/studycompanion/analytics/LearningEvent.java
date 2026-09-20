package com.studycompanion.analytics;

import com.studycompanion.project.entity.Project;
import com.studycompanion.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum EventType {
        PROJECT_CREATED,
        MATERIAL_UPLOADED,
        MATERIAL_PROCESSED,
        TUTOR_INTERACTION,
        QUIZ_STARTED,
        QUESTION_ANSWERED,
        QUIZ_COMPLETED,
        ASSESSMENT_COMPLETED,
        MASTERY_UPDATED,
        RECOMMENDATION_CREATED,
        RECOMMENDATION_COMPLETED
    }
}