package com.studycompanion.quiz.service;

import com.studycompanion.analytics.LearningEvent;
import com.studycompanion.analytics.LearningEventService;
import com.studycompanion.assessment.*;
import com.studycompanion.assessment.repository.QuestionRepository;
import com.studycompanion.concept.entity.Concept;
import com.studycompanion.concept.repository.ConceptRepository;
import com.studycompanion.quiz.repository.QuizAnswerRepository;
import com.studycompanion.quiz.dto.QuizResponse;
import com.studycompanion.quiz.dto.SubmitAnswerRequest;
import com.studycompanion.quiz.repository.QuizRepository;
import com.studycompanion.project.entity.Project;
import com.studycompanion.project.repository.ProjectRepository;
import com.studycompanion.quiz.dto.QuizGenerationResponse;
import com.studycompanion.quiz.entity.Quiz;
import com.studycompanion.quiz.entity.QuizAnswer;
import com.studycompanion.recommendation.service.RecommendationService;
import com.studycompanion.user.entity.User;
import com.studycompanion.user.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.studycompanion.ai.service.AIUsageService;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.metadata.Usage;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    private final ChatClient chatClient;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ConceptRepository conceptRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final MasteryService masteryService;
    private final RecommendationService recommendationService;
    private final LearningEventService learningEventService;
    private final AIUsageService aiUsageService;

    public QuizService(
            ChatClient.Builder chatClientBuilder,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ConceptRepository conceptRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizAnswerRepository quizAnswerRepository,
            MasteryService masteryService,
            RecommendationService recommendationService,
            LearningEventService learningEventService,
            AIUsageService aiUsageService
    ) {
        this.chatClient = chatClientBuilder.build();
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.conceptRepository = conceptRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAnswerRepository=quizAnswerRepository;
        this.masteryService =masteryService;
        this.recommendationService=recommendationService;
        this.learningEventService=learningEventService;
        this.aiUsageService = aiUsageService;
    }

    @Transactional
    public QuizGenerationResponse generateQuiz(
            Long projectId,
            Long userId
    ) {

        // 1. Verify project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        // 2. Verify user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 3. Get concepts for this project
        List<Concept> concepts =
                conceptRepository.findByProjectId(projectId);

        if (concepts.isEmpty()) {
            throw new RuntimeException(
                    "No concepts found for this project"
            );
        }

        // 4. Build concept context
        StringBuilder conceptContext = new StringBuilder();

        for (Concept concept : concepts) {

            conceptContext.append("- ")
                    .append(concept.getName())
                    .append(": ")
                    .append(concept.getDescription())
                    .append("\n");
        }

        // 5. Prompt Gemini
        String prompt = """
                You are an educational quiz generation system.

                Generate exactly 5 multiple-choice questions
                based ONLY on the concepts provided below.

                Rules:
                - Every question must test one of the provided concepts.
                - Do not introduce concepts outside the list.
                - Each question must have exactly 4 options.
                - There must be exactly one correct answer.
                - Difficulty must be an integer from 1 to 5.
                - Use different concepts when possible.
                - Make questions clear and educational.
                - Do not duplicate questions.

                Available concepts:

                %s
                """.formatted(conceptContext);

        ResponseEntity<ChatResponse, QuizGenerationResponse> result =
                chatClient.prompt()
                        .user(prompt)
                        .call()
                        .responseEntity(QuizGenerationResponse.class);

        QuizGenerationResponse response = result.entity();

        ChatResponse chatResponse = result.response();

        Usage usage = chatResponse.getMetadata().getUsage();

        aiUsageService.recordUsage(
                "OPENROUTER",
                chatResponse.getMetadata().getModel(),
                "QUIZ_GENERATION",
                usage.getPromptTokens().longValue(),
                usage.getCompletionTokens().longValue(),
                userId
        );

        if (response == null ||
                response.questions() == null ||
                response.questions().isEmpty()) {

            throw new RuntimeException(
                    "Failed to generate quiz"
            );
        }

        // 6. Create Quiz
        Quiz quiz = Quiz.builder()
                .project(project)
                .user(user)
                .startedAt(LocalDateTime.now())
                .totalQuestions(response.questions().size())
                .correctAnswers(0)
                .status(Quiz.Status.IN_PROGRESS)
                .build();

        quizRepository.save(quiz);

        learningEventService.record(
                userId,
                projectId,
                LearningEvent.EventType.QUIZ_STARTED,
                "Quiz started with "
                        + quiz.getTotalQuestions()
                        + " questions"
        );

        // 7. Save generated questions
        for (QuizGenerationResponse.GeneratedQuestion generated
                : response.questions()) {

            Concept concept =
                    conceptRepository
                            .findByProjectIdAndNameIgnoreCase(
                                    projectId,
                                    generated.concept()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Concept not found: "
                                                    + generated.concept()
                                    )
                            );

            Question question = Question.builder()
                    .quiz(quiz)
                    .concept(concept)
                    .type(Question.Type.MCQ)
                    .questionText(generated.question())
                    .options(String.join(
                            "|||",
                            generated.options()
                    ))
                    .correctAnswer(generated.correctAnswer())
                    .difficulty(generated.difficulty())
                    .build();

            questionRepository.save(question);
        }

// 8. Return quiz information
        return new QuizGenerationResponse(
                quiz.getId(),
                projectId,
                quiz.getTotalQuestions(),
                response.questions()
        );
    }

    @Transactional(readOnly = true)
    public QuizResponse getQuiz(
            Long quizId,
            Long userId,
            Long projectId
    ) {

        // 1. Find quiz belonging to this user and project
        Quiz quiz = quizRepository
                .findByIdAndUserIdAndProjectId(
                        quizId,
                        userId,
                        projectId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Quiz not found"
                        )
                );

        // 2. Get questions
        List<Question> questions =
                questionRepository.findByQuizId(quizId);

        // 3. Convert questions to safe response
        List<QuizResponse.QuestionResponse> questionResponses =
                questions.stream()
                        .map(question -> {

                            List<String> options =
                                    List.of(
                                            question.getOptions()
                                                    .split("\\|\\|\\|")
                                    );

                            return new QuizResponse.QuestionResponse(
                                    question.getId(),
                                    question.getConcept().getId(),
                                    question.getConcept().getName(),
                                    question.getQuestionText(),
                                    options,
                                    question.getDifficulty()
                            );
                        })
                        .toList();

        // 4. Return quiz
        return new QuizResponse(
                quiz.getId(),
                quiz.getProject().getId(),
                quiz.getTotalQuestions(),
                quiz.getStatus().name(),
                questionResponses
        );
    }

    @Transactional
    public AnswerResponse submitAnswer(
            Long quizId,
            Long userId,
            Long projectId,
            SubmitAnswerRequest request
    ) {

        // 1. Verify quiz belongs to user and project
        Quiz quiz = quizRepository
                .findByIdAndUserIdAndProjectId(
                        quizId,
                        userId,
                        projectId
                )
                .orElseThrow(() ->
                        new RuntimeException("Quiz not found")
                );

        // 2. Make sure quiz is still active
        if (quiz.getStatus() == Quiz.Status.COMPLETED) {
            throw new RuntimeException(
                    "Quiz has already been completed"
            );
        }

        // 3. Find question
        Question question = questionRepository
                .findById(request.questionId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Question not found"
                        )
                );

        // 4. Make sure question belongs to this quiz
        if (!question.getQuiz().getId().equals(quizId)) {
            throw new RuntimeException(
                    "Question does not belong to this quiz"
            );
        }

        // 5. Prevent answering same question twice
        if (quizAnswerRepository
                .findByQuizIdAndQuestionId(
                        quizId,
                        question.getId()
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Question has already been answered"
            );
        }

        // 6. Check answer
        boolean correct =
                question.getCorrectAnswer()
                        .trim()
                        .equalsIgnoreCase(
                                request.answer().trim()
                        );

        // 7. Save answer
        QuizAnswer quizAnswer = QuizAnswer.builder()
                .quiz(quiz)
                .question(question)
                .user(quiz.getUser())
                .answer(request.answer())
                .correct(correct)
                .score(correct ? 1.0 : 0.0)
                .answeredAt(LocalDateTime.now())
                .build();

        quizAnswerRepository.save(quizAnswer);

        learningEventService.record(
                userId,
                projectId,
                LearningEvent.EventType.QUESTION_ANSWERED,
                "Question answered. Correct: "
                        + quizAnswer.getCorrect()
        );

        // 8. Update quiz score
        if (correct) {
            quiz.setCorrectAnswers(
                    quiz.getCorrectAnswers() + 1
            );
        }

        // 9. Check whether all questions are answered
        long answeredCount =
                quizAnswerRepository
                        .findByQuizId(quizId)
                        .size();

        if (answeredCount >= quiz.getTotalQuestions()) {

            quiz.setStatus(Quiz.Status.COMPLETED);
            quiz.setCompletedAt(LocalDateTime.now());

            masteryService.updateMasteryFromQuiz(quiz);

            recommendationService.generateRecommendation(
                    userId,
                    projectId
            );

            learningEventService.record(
                    userId,
                    projectId,
                    LearningEvent.EventType.QUIZ_COMPLETED,
                    "Quiz completed. Score: "
                            + quiz.getCorrectAnswers()
                            + "/"
                            + quiz.getTotalQuestions()
            );
        }
        quizRepository.save(quiz);

        // 10. Return result
        return new AnswerResponse(
                question.getId(),
                request.answer(),
                correct,
                question.getCorrectAnswer()
        );
    }
}