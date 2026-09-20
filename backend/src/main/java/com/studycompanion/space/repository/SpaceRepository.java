package com.studycompanion.space.repository;

import com.studycompanion.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    List<Space> findByUserId(Long userId);
}