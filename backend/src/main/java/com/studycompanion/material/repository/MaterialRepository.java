package com.studycompanion.material.repository;

import com.studycompanion.material.entity.Material;
import com.studycompanion.material.entity.MaterialStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findByProjectId(Long projectId);

    List<Material> findByStatus(MaterialStatus status);
}