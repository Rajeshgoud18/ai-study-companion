package com.studycompanion.analytics.controller;

import com.studycompanion.analytics.dto.AnalyticsResponse;
import com.studycompanion.analytics.service.AnalyticsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/project")
    public AnalyticsResponse getProjectAnalytics(
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getDetails();

        return analyticsService.getProjectAnalytics(
                userId,
                projectId
        );
    }
}