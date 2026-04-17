package com.tcc.art.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.google")
public record GoogleAiProperties(
        String apiKey,
        String embeddingModel,
        String embeddingUrl,
        String geminiModel,
        String geminiUrl
) {}
