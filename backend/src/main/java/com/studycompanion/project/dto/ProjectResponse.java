package com.studycompanion.project.dto;

public record ProjectResponse(
        Long id,
        Long spaceId,
        String name,
        String description,
        String learningGoal
) {}