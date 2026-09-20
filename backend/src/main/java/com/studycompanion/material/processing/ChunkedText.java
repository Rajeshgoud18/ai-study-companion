package com.studycompanion.material.processing;

public record ChunkedText(
        String content,
        int pageNumber,
        int chunkIndex
) {
}