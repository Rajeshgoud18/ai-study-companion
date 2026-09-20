package com.studycompanion.material.processing;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TextChunker {

    private static final int CHUNK_SIZE = 1000;
    private static final int OVERLAP = 200;

    public List<ChunkedText> chunk(
            List<ExtractedPage> pages
    ) {

        List<ChunkedText> chunks = new ArrayList<>();

        int globalChunkIndex = 0;

        for (ExtractedPage page : pages) {

            String text = page.text();

            int start = 0;

            while (start < text.length()) {

                int end = Math.min(
                        start + CHUNK_SIZE,
                        text.length()
                );

                String content = text
                        .substring(start, end)
                        .trim();

                if (!content.isBlank()) {

                    chunks.add(
                            new ChunkedText(
                                    content,
                                    page.pageNumber(),
                                    globalChunkIndex++
                            )
                    );
                }

                if (end == text.length()) {
                    break;
                }

                start = end - OVERLAP;
            }
        }

        return chunks;
    }
}