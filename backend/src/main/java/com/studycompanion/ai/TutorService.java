package com.studycompanion.ai;

import com.studycompanion.ai.service.AIUsageService;
import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventService;
import com.studycompanion.tutor.Conversation;
import com.studycompanion.tutor.ConversationRepository;
import com.studycompanion.tutor.Message;
import com.studycompanion.tutor.MessageRepository;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.ai.chat.metadata.Usage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class TutorService {

    private final ChatClient chatClient;
    private final VectorSearchService vectorSearchService;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final LearningEventService learningEventService;
    private final UserRepository userRepository;
    private final AIUsageService aiUsageService;

    public TutorService(
            ChatClient.Builder chatClientBuilder,
            VectorSearchService vectorSearchService,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            ProjectRepository projectRepository,
            LearningEventService learningEventService,
            UserRepository userRepository,
            AIUsageService aiUsageService) {

        this.chatClient = chatClientBuilder.build();
        this.vectorSearchService = vectorSearchService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.projectRepository=projectRepository;
        this.learningEventService = learningEventService;
        this.userRepository=userRepository;
        this.aiUsageService = aiUsageService;
    }

    public TutorResponse ask(
            Long userId,
            Long projectId,
            String question
    ) {

        // 1. Find existing conversation or create one
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!project.getSpace().getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to access this project"
            );
        }

        Conversation conversation =
                conversationRepository.findByProjectId(projectId)
                        .orElseGet(() -> {

                            Conversation newConversation =
                                    Conversation.builder()
                                            .project(project)
                                            .build();

                            return conversationRepository.save(
                                    newConversation
                            );
                        });

        // 2. Save user's message
        Message userMessage = Message.builder()
                .conversation(conversation)
                .role(Message.Role.USER)
                .content(question)
                .build();

        messageRepository.save(userMessage);

        learningEventService.record(
                userId,
                projectId,
                LearningEvent.EventType.TUTOR_INTERACTION,
                "Tutor interaction for question: " + question
        );

        // 3. Retrieve relevant project knowledge
        List<Document> documents =
                vectorSearchService.search(question, projectId, 5);

        // 4. Build study material context
        StringBuilder context = new StringBuilder();

        for (Document document : documents) {

            context.append("Page ")
                    .append(document.getMetadata().get("pageNumber"))
                    .append(":\n");

            context.append(document.getText())
                    .append("\n\n");
        }

        // 5. Retrieve recent conversation history
        List<Message> previousMessages =
                messageRepository
                        .findTop10ByConversationIdOrderByIdDesc(
                                conversation.getId()
                        );

        StringBuilder conversationContext =
                new StringBuilder();

        for (int i = previousMessages.size() - 1; i >= 0; i--) {

            Message message = previousMessages.get(i);

            conversationContext
                    .append(message.getRole())
                    .append(": ")
                    .append(message.getContent())
                    .append("\n");
        }

        // 6. Build grounded tutor prompt
        String prompt = """
                You are an AI Study Tutor.

                Answer the student's question using ONLY the
                provided study material.

                You may use the conversation history only to
                understand references such as "it", "this",
                "that", or follow-up questions.

                Do not use outside knowledge.

                If the answer cannot be found in the study
                material, say:

                "I don't have enough information in the provided
                study material to answer this question."

                Do not make up information.

                Conversation history:
                %s

                Study material:
                %s

                Current student question:
                %s

                Give a clear and educational answer.
                """.formatted(
                conversationContext,
                context,
                question
        );

        // 7. Generate answer
        ChatResponse response = chatClient.prompt()
                .user(prompt)
                .call()
                .chatResponse();

        String answer = response.getResult()
                .getOutput()
                .getText();

        Usage usage = response.getMetadata().getUsage();

        aiUsageService.recordUsage(
                "OPENROUTER",
                response.getMetadata().getModel(),
                "TUTOR",
                usage.getPromptTokens().longValue(),
                usage.getCompletionTokens().longValue(),
                userId
        );

//        System.out.println("Model: " + response.getMetadata().getModel());
//        System.out.println("Prompt Tokens: " + usage.getPromptTokens());
//        System.out.println("Completion Tokens: " + usage.getCompletionTokens());
//        System.out.println("Total Tokens: " + usage.getTotalTokens());

        // 8. Save assistant response
        Message assistantMessage = Message.builder()
                .conversation(conversation)
                .role(Message.Role.ASSISTANT)
                .content(answer)
                .build();

        messageRepository.save(assistantMessage);

// 9. Create citations only when the answer is supported
        List<TutorResponse.Citation> citations = new ArrayList<>();

        String unsupportedMessage =
                "I don't have enough information in the provided study material to answer this question.";

        if (!answer.trim().equalsIgnoreCase(unsupportedMessage)) {

            Set<TutorResponse.Citation> uniqueCitations =
                    new LinkedHashSet<>();

            for (Document document : documents) {

                String fileName =
                        (String) document.getMetadata().get("fileName");

                Integer pageNumber =
                        ((Number) document.getMetadata()
                                .get("pageNumber"))
                                .intValue();

                uniqueCitations.add(
                        new TutorResponse.Citation(
                                fileName,
                                pageNumber
                        )
                );
            }

            citations = new ArrayList<>(uniqueCitations);
        }

        return new TutorResponse(answer, citations);
    }
}