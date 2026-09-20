package com.studycompanion.material.processing;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
public class PdfTextExtractor {

    public List<ExtractedPage> extractPages(Path filePath) {

        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();

            List<ExtractedPage> pages = new ArrayList<>();

            for (int page = 1; page <= document.getNumberOfPages(); page++) {

                stripper.setStartPage(page);
                stripper.setEndPage(page);

                String text = stripper.getText(document).trim();

                if (!text.isBlank()) {
                    pages.add(
                            new ExtractedPage(page, text)
                    );
                }
            }

            return pages;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to extract text from PDF",
                    e
            );
        }
    }
}