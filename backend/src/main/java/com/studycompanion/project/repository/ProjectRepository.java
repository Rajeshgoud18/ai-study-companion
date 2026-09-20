package com.studycompanion.project.repository;

import com.studycompanion.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findBySpaceId(Long spaceId);
    List<Project> findBySpaceUserId(Long userId);
}