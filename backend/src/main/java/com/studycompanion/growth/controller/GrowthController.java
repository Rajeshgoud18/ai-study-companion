package com.studycompanion.growth.controller;

import com.studycompanion.growth.dto.GrowthResponse;
import com.studycompanion.growth.service.GrowthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/growth")
public class GrowthController {

    private final GrowthService growthService;

    public GrowthController(GrowthService growthService) {
        this.growthService = growthService;
    }

    @GetMapping("/project")
    public GrowthResponse getGrowth(
            @RequestParam Long userId,
            @RequestParam Long projectId
    ) {
        return growthService.getGrowth(
                userId,
                projectId
        );
    }
}