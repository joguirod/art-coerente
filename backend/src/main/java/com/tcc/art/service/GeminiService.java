package com.tcc.art.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcc.art.config.GoogleAiProperties;
import com.tcc.art.exception.ExternalApiException;
import com.tcc.art.model.Art;
import com.tcc.art.model.KnowledgeChunk;
import com.tcc.art.util.PromptBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final WebClient webClient;
    private final GoogleAiProperties googleAiProperties;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    private static final int MAX_RETRIES = 3;

    public GeminiService(WebClient webClient,
                         GoogleAiProperties googleAiProperties,
                         PromptBuilder promptBuilder,
                         ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.googleAiProperties = googleAiProperties;
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
    }

    /**
     * Calls Gemini Flash with the analysis prompt. Retries up to 3 times with exponential backoff.
     * Returns the raw JSON string from Gemini.
     */
    public Map<String, Object> analyze(Art art, List<KnowledgeChunk> chunks) {
        log.info("Iniciando análise Gemini para ART id={}", art.getId());
        String prompt = promptBuilder.build(art, chunks);
        Exception lastException = null;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String rawJson = callGemini(prompt);
                Map<String, Object> result = parseResponse(rawJson);
                log.info("Análise Gemini concluída para ART id={} na tentativa {}", art.getId(), attempt);
                return result;
            } catch (ExternalApiException e) {
                log.warn("Tentativa {}/{} falhou para ART id={}: {}", attempt, MAX_RETRIES, art.getId(), e.getMessage());
                lastException = e;
                if (attempt < MAX_RETRIES) {
                    sleepWithBackoff(attempt);
                }
            } catch (Exception e) {
                log.warn("Tentativa {}/{} – falha ao parsear resposta para ART id={}: {}", attempt, MAX_RETRIES, art.getId(), e.getMessage());
                if (attempt == MAX_RETRIES) {
                    log.error("Todas as {} tentativas esgotadas para ART id={}", MAX_RETRIES, art.getId(), e);
                    throw new ExternalApiException("Falha ao processar resposta da API de análise", e);
                }
                prompt = addJsonEnfasis(prompt);
                lastException = e;
                sleepWithBackoff(attempt);
            }
        }

        log.error("Serviço Gemini indisponível após {} tentativas para ART id={}", MAX_RETRIES, art.getId(), lastException);
        throw new ExternalApiException("Serviço de análise temporariamente indisponível", lastException);
    }

    private String callGemini(String prompt) {
        String url = googleAiProperties.geminiUrl()
                + "/" + googleAiProperties.geminiModel()
                + ":generateContent?key=" + googleAiProperties.apiKey();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "responseMimeType", "application/json"
                )
        );

        Map<?, ?> response = webClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> {
                                    log.error("Gemini retornou erro HTTP: {}", body);
                                    return new ExternalApiException("Erro na API de análise: " + body);
                                }))
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            log.error("Gemini retornou resposta nula");
            throw new ExternalApiException("Serviço de análise temporariamente indisponível");
        }

        // Extract text from response
        List<?> candidates = (List<?>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            log.error("Gemini retornou resposta sem candidatos: {}", response);
            throw new ExternalApiException("Serviço de análise não retornou resultado válido");
        }
        Map<?, ?> content = (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");
        List<?> parts = (List<?>) content.get("parts");
        return (String) ((Map<?, ?>) parts.get(0)).get("text");
    }

    private Map<String, Object> parseResponse(String rawJson) {
        try {
            // Clean up potential markdown code blocks
            String cleaned = rawJson.strip();
            if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
            if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
            if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);

            return objectMapper.readValue(cleaned.strip(), Map.class);
        } catch (Exception e) {
            log.error("Falha ao parsear JSON da resposta Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to parse Gemini response JSON", e);
        }
    }

    private String addJsonEnfasis(String prompt) {
        return prompt + "\n\nIMPORTANTE: Responda EXCLUSIVAMENTE com um objeto JSON válido. Não inclua texto, markdown, ou explicações fora do JSON.";
    }

    private void sleepWithBackoff(int attempt) {
        try {
            long ms = (long) Math.pow(2, attempt) * 1000L;
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
