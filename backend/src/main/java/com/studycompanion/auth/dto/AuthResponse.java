package com.studycompanion.auth.dto;

public record AuthResponse(
        Long userId,
        String name,
        String email,
        String role,
        String token
) {}