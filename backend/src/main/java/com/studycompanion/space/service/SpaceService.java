package com.studycompanion.space.service;

import com.studycompanion.space.dto.CreateSpaceRequest;
import com.studycompanion.space.dto.SpaceResponse;
import com.studycompanion.space.entity.Space;
import com.studycompanion.space.repository.SpaceRepository;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;

    public SpaceService(
            SpaceRepository spaceRepository,
            UserRepository userRepository
    ) {
        this.spaceRepository = spaceRepository;
        this.userRepository = userRepository;
    }

    public SpaceResponse createSpace(
            Long userId,
            CreateSpaceRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Space space = Space.builder()
                .name(request.name())
                .description(request.description())
                .user(user)
                .build();

        Space savedSpace = spaceRepository.save(space);

        return toResponse(savedSpace);
    }

    public List<SpaceResponse> getUserSpaces(Long userId) {

        return spaceRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SpaceResponse getSpace(
            Long userId,
            Long spaceId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Space not found")
                );

        verifyOwnership(space, userId);

        return toResponse(space);
    }

    public void deleteSpace(
            Long userId,
            Long spaceId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Space not found")
                );

        verifyOwnership(space, userId);

        spaceRepository.delete(space);
    }

    private void verifyOwnership(
            Space space,
            Long userId
    ) {

        if (!space.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this space"
            );
        }
    }

    private SpaceResponse toResponse(Space space) {

        return new SpaceResponse(
                space.getId(),
                space.getName(),
                space.getDescription()
        );
    }
}