package com.tcc.art.dto.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcc.art.model.CoherenceAnalysis;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record AnalysisResponse(
        UUID id,
        Integer score,
        Boolean coherent,
        String summary,
        List<Map<String, Object>> alerts,
        List<String> suggestions,
        List<String> complementaryRecommendations,
        List<Map<String, String>> chunksUsed,
        LocalDateTime createdAt
) {
    public static AnalysisResponse from(CoherenceAnalysis analysis, ObjectMapper objectMapper) {
        try {
            List<Map<String, Object>> alerts = analysis.getAlerts() != null
                    ? objectMapper.readValue(analysis.getAlerts(), new TypeReference<>() {})
                    : List.of();
            List<String> suggestions = analysis.getSuggestions() != null
                    ? objectMapper.readValue(analysis.getSuggestions(), new TypeReference<>() {})
                    : List.of();
            List<String> complementary = analysis.getComplementaryRecommendations() != null
                    ? objectMapper.readValue(analysis.getComplementaryRecommendations(), new TypeReference<>() {})
                    : List.of();
            List<Map<String, String>> chunks = analysis.getChunksUsed() != null
                    ? objectMapper.readValue(analysis.getChunksUsed(), new TypeReference<>() {})
                    : List.of();

            return new AnalysisResponse(
                    analysis.getId(),
                    analysis.getScore(),
                    analysis.getCoherent(),
                    analysis.getSummary(),
                    alerts,
                    suggestions,
                    complementary,
                    chunks,
                    analysis.getCreatedAt()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize analysis data", e);
        }
    }
}
