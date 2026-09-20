package com.studycompanion.material.dto;

import com.studycompanion.material.entity.MaterialStatus;

public record MaterialResponse(
        Long id,
        Long projectId,
        String fileName,
        String fileType,
        Long fileSize,
        MaterialStatus status,
        String errorMessage
) {}