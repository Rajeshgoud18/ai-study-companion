package com.studycompanion.ai.service;

import com.studycompanion.admin.dto.AIModelUsageResponse;
import com.studycompanion.admin.dto.AIUsageSummaryResponse;
import com.studycompanion.ai.entity.AIUsage;
import com.studycompanion.ai.repository.AIUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIUsageService {

    private final AIUsageRepository aiUsageRepository;

    public void recordUsage(
            String provider,
            String model,
            String operation,
            Long inputTokens,
            Long outputTokens,
            Long userId
    ) {

        long safeInputTokens = inputTokens == null ? 0 : inputTokens;
        long safeOutputTokens = outputTokens == null ? 0 : outputTokens;

        long totalTokens = safeInputTokens + safeOutputTokens;

        double estimatedCost = calculateCost(
                model,
                safeInputTokens,
                safeOutputTokens
        );

        AIUsage usage = AIUsage.builder()
                .provider(provider)
                .model(model)
                .operation(operation)
                .inputTokens(safeInputTokens)
                .outputTokens(safeOutputTokens)
                .totalTokens(totalTokens)
                .estimatedCost(estimatedCost)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        aiUsageRepository.save(usage);
    }

    private double calculateCost(
            String model,
            long inputTokens,
            long outputTokens
    ) {

        double inputPricePerMillion;
        double outputPricePerMillion;

        switch (model) {

            case "google/gemini-2.5-flash" -> {
                inputPricePerMillion = 0.30;
                outputPricePerMillion = 2.50;
            }

            case "openai/gpt-oss-120b" -> {
                inputPricePerMillion = 0.03;
                outputPricePerMillion = 0.17;
            }

            case "openai/text-embedding-3-small" -> {
                inputPricePerMillion = 0.02;
                outputPricePerMillion = 0.0;
            }

            default -> {
                return 0.0;
            }
        }

        return
                (inputTokens / 1_000_000.0) * inputPricePerMillion
                        +
                        (outputTokens / 1_000_000.0) * outputPricePerMillion;
    }

    public AIUsageSummaryResponse getUsageSummary() {

        long totalRequests = aiUsageRepository.count();

        long totalInputTokens =
                aiUsageRepository.getTotalInputTokens();

        long totalOutputTokens =
                aiUsageRepository.getTotalOutputTokens();

        long totalTokens =
                aiUsageRepository.getTotalTokens();

        double estimatedCost =
                aiUsageRepository.getTotalEstimatedCost();

        return new AIUsageSummaryResponse(
                totalRequests,
                totalInputTokens,
                totalOutputTokens,
                totalTokens,
                estimatedCost
        );
    }


    public List<AIModelUsageResponse> getUsageByModel() {

        return aiUsageRepository.getUsageByModel()
                .stream()
                .map(row -> new AIModelUsageResponse(
                        (String) row[0],
                        (String) row[1],
                        ((Number) row[2]).longValue(),
                        ((Number) row[3]).longValue(),
                        ((Number) row[4]).longValue(),
                        ((Number) row[5]).longValue(),
                        ((Number) row[6]).doubleValue()
                ))
                .toList();
    }
}