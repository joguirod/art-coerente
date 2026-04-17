package com.tcc.art.service;

import com.tcc.art.config.GoogleAiProperties;
import com.tcc.art.exception.ExternalApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);

    private final WebClient webClient;
    private final GoogleAiProperties googleAiProperties;

    public EmbeddingService(WebClient webClient, GoogleAiProperties googleAiProperties) {
        this.webClient = webClient;
        this.googleAiProperties = googleAiProperties;
    }

    /**
     * Generates a 768-dimension embedding vector for the given text using Google text-embedding-004.
     */
    public float[] embed(String text) {
        String url = googleAiProperties.embeddingUrl()
                + "/" + googleAiProperties.embeddingModel()
                + ":embedContent?key=" + googleAiProperties.apiKey();

        Map<String, Object> requestBody = Map.of(
                "model", "models/" + googleAiProperties.embeddingModel(),
                "content", Map.of("parts", List.of(Map.of("text", text)))
        );

        try {
            Map<?, ?> response = webClient.post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                log.error("API de embeddings retornou resposta nula");
                throw new ExternalApiException("Serviço de análise temporariamente indisponível");
            }

            Map<?, ?> embedding = (Map<?, ?>) response.get("embedding");
            List<?> values = (List<?>) embedding.get("values");

            float[] result = new float[values.size()];
            for (int i = 0; i < values.size(); i++) {
                result[i] = ((Number) values.get(i)).floatValue();
            }
            return result;
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Falha ao gerar embedding: {}", e.getMessage(), e);
            throw new ExternalApiException("Serviço de análise temporariamente indisponível", e);
        }
    }
}
