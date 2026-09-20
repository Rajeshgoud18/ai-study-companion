package com.studycompanion.project.service;

import com.studycompanion.project.dto.CreateProjectRequest;
import com.studycompanion.project.dto.ProjectResponse;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.space.entity.Space;
import com.studycompanion.space.repository.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SpaceRepository spaceRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            SpaceRepository spaceRepository
    ) {
        this.projectRepository = projectRepository;
        this.spaceRepository = spaceRepository;
    }

    public ProjectResponse createProject(
            Long userId,
            Long spaceId,
            CreateProjectRequest request
    ) {

        Space space = getOwnedSpace(spaceId, userId);

        Project project = Project.builder()
                .name(request.name())
                .description(request.description())
                .learningGoal(request.learningGoal())
                .space(space)
                .build();

        Project savedProject = projectRepository.save(project);

        return toResponse(savedProject);
    }

    public List<ProjectResponse> getProjects(
            Long userId,
            Long spaceId
    ) {

        getOwnedSpace(spaceId, userId);

        return projectRepository.findBySpaceId(spaceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProject(
            Long userId,
            Long projectId
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Project not found")
                );

        verifyProjectOwnership(project, userId);

        return toResponse(project);
    }

    public void deleteProject(
            Long userId,
            Long projectId
    ) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Project not found")
                );

        verifyProjectOwnership(project, userId);

        projectRepository.delete(project);
    }

    private Space getOwnedSpace(
            Long spaceId,
            Long userId
    ) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Space not found")
                );

        if (!space.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this space"
            );
        }

        return space;
    }

    private void verifyProjectOwnership(
            Project project,
            Long userId
    ) {

        if (!project.getSpace().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }
    }

    private ProjectResponse toResponse(Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getSpace().getId(),
                project.getName(),
                project.getDescription(),
                project.getLearningGoal()
        );
    }
}