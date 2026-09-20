package com.studycompanion.admin.dto;

public record AdminProjectResponse(
        Long id,
        String name,
        Long spaceId,
        String spaceName
) {
}