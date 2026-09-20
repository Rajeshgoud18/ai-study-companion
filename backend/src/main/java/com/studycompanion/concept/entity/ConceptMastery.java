package com.studycompanion.concept.entity;

import com.studycompanion.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "concept_mastery",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "concept_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConceptMastery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "concept_id", nullable = false)
    private Concept concept;

    @Column(nullable = false)
    private Double masteryScore;

    @Column(nullable = false)
    private Integer questionsAnswered;

    @Column(nullable = false)
    private Integer questionsCorrect;
}