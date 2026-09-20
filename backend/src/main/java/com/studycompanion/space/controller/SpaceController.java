package com.studycompanion.space.controller;

import com.studycompanion.space.dto.CreateSpaceRequest;
import com.studycompanion.space.dto.SpaceResponse;
import com.studycompanion.space.service.SpaceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @PostMapping
    public ResponseEntity<SpaceResponse> createSpace(
            @Valid @RequestBody CreateSpaceRequest request,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        SpaceResponse response =
                spaceService.createSpace(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<SpaceResponse>> getUserSpaces(
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        return ResponseEntity.ok(
                spaceService.getUserSpaces(userId)
        );
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity<SpaceResponse> getSpace(
            @PathVariable Long spaceId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        return ResponseEntity.ok(
                spaceService.getSpace(userId, spaceId)
        );
    }

    @DeleteMapping("/{spaceId}")
    public ResponseEntity<Void> deleteSpace(
            @PathVariable Long spaceId,
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getDetails();

        spaceService.deleteSpace(userId, spaceId);

        return ResponseEntity.noContent().build();
    }
}