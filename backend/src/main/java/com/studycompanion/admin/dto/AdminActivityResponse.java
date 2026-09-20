package com.studycompanion.admin.dto;

import java.time.LocalDateTime;

public record AdminActivityResponse(
        Long id,
        Long userId,
        Long projectId,
        String eventType,
        String metadata,
        LocalDateTime createdAt
) {}