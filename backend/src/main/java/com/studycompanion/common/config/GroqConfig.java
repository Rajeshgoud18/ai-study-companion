package com.studycompanion.common.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GroqConfig {

    @Bean
    public ChatClient groqChatClient() {

        OpenAiChatOptions options =
                OpenAiChatOptions.builder()
                        .baseUrl("https://api.groq.com/openai/v1")
                        .apiKey(System.getenv("GROQ_API_KEY"))
                        .model("openai/gpt-oss-120b")
                        .temperature(0.2)
                        .maxTokens(600)
                        .responseFormat(
                                OpenAiChatModel.ResponseFormat.builder()
                                        .type(OpenAiChatModel.ResponseFormat.Type.JSON_OBJECT)
                                        .build()
                        )
                        .build();

        OpenAiChatModel groqModel =
                OpenAiChatModel.builder()
                        .options(options)
                        .build();

        return ChatClient.builder(groqModel).build();
    }
}