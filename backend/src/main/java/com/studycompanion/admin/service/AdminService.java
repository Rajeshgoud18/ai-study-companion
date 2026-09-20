package com.studycompanion.admin.service;

import com.studycompanion.admin.dto.AdminActivityResponse;
import com.studycompanion.admin.dto.AdminUserResponse;
import com.studycompanion.admin.dto.AdminProjectDetailResponse;
import com.studycompanion.analytics.LearningEventRepository;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.space.repository.SpaceRepository;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.studycompanion.admin.dto.AdminProjectResponse;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final ProjectRepository projectRepository;
    private final LearningEventRepository learningEventRepository;

    public AdminService(
            UserRepository userRepository,
            SpaceRepository spaceRepository,
            ProjectRepository projectRepository,
            LearningEventRepository learningEventRepository
    ) {
        this.userRepository = userRepository;
        this.spaceRepository = spaceRepository;
        this.projectRepository = projectRepository;
        this.learningEventRepository = learningEventRepository;
    }

    public AdminProjectDetailResponse.AdminOverviewResponse getOverview() {

        return new AdminProjectDetailResponse.AdminOverviewResponse(
                userRepository.count(),
                spaceRepository.count(),
                projectRepository.count(),
                learningEventRepository.count()
        );
    }

    public List<AdminUserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .toList();
    }

    public List<AdminActivityResponse> getUserActivity(Long userId) {

        return learningEventRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(event -> new AdminActivityResponse(
                        event.getId(),
                        event.getUser().getId(),
                        event.getProject().getId(),
                        event.getEventType().name(),
                        event.getMetadata(),
                        event.getCreatedAt()
                ))
                .toList();
    }

    public List<AdminProjectResponse> getUserProjects(Long userId) {
        return projectRepository.findBySpaceUserId(userId)
                .stream()
                .map(project -> new AdminProjectResponse(
                        project.getId(),
                        project.getName(),
                        project.getSpace().getId(),
                        project.getSpace().getName()
                ))
                .toList();
    }

    public AdminProjectDetailResponse getProjectDetails(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = project.getSpace().getUser();

        return new AdminProjectDetailResponse(
                project.getId(),
                project.getName(),
                project.getSpace().getId(),
                project.getSpace().getName(),
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}