package com.studycompanion.tutor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByProjectId(Long projectId);
}