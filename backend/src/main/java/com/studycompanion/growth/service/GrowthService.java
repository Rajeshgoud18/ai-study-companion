package com.studycompanion.growth.service;

import com.studycompanion.concept.entity.ConceptMastery;
import com.studycompanion.concept.repository.ConceptMasteryRepository;
import com.studycompanion.growth.dto.GrowthResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GrowthService {

    private final ConceptMasteryRepository conceptMasteryRepository;

    public GrowthService(
            ConceptMasteryRepository conceptMasteryRepository
    ) {
        this.conceptMasteryRepository =
                conceptMasteryRepository;
    }

    @Transactional(readOnly = true)
    public GrowthResponse getGrowth(
            Long userId,
            Long projectId
    ) {

        List<ConceptMastery> masteryList =
                conceptMasteryRepository
                        .findByUserIdAndConceptProjectId(
                                userId,
                                projectId
                        );

        if (masteryList.isEmpty()) {
            return new GrowthResponse(
                    0.0,
                    "NO_DATA",
                    List.of()
            );
        }

        // Calculate overall mastery
        double totalMastery = 0.0;

        for (ConceptMastery mastery : masteryList) {
            totalMastery += mastery.getMasteryScore();
        }

        double overallMastery =
                totalMastery / masteryList.size();

        // Build concept growth information
        List<GrowthResponse.ConceptGrowth> concepts =
                masteryList.stream()
                        .map(mastery -> {

                            double score =
                                    mastery.getMasteryScore();

                            return new GrowthResponse.ConceptGrowth(
                                    mastery.getConcept().getId(),
                                    mastery.getConcept().getName(),
                                    score,
                                    getStatus(score)
                            );
                        })
                        .toList();

        return new GrowthResponse(
                overallMastery,
                getStatus(overallMastery),
                concepts
        );
    }

    private String getStatus(double mastery) {

        if (mastery >= 0.70) {
            return "STRONG";
        }

        if (mastery >= 0.40) {
            return "DEVELOPING";
        }

        return "NEEDS_ATTENTION";
    }
}