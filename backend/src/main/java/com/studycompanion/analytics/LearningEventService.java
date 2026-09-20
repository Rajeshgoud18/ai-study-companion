package com.studycompanion.analytics;

import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LearningEventService {

    private final LearningEventRepository learningEventRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public LearningEventService(
            LearningEventRepository learningEventRepository,
            UserRepository userRepository,
            ProjectRepository projectRepository
    ) {
        this.learningEventRepository = learningEventRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public LearningEvent record(
            Long userId,
            Long projectId,
            LearningEvent.EventType eventType,
            String metadata
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        LearningEvent event = LearningEvent.builder()
                .user(user)
                .project(project)
                .eventType(eventType)
                .metadata(metadata)
                .createdAt(LocalDateTime.now())
                .build();

        return learningEventRepository.save(event);
    }
}