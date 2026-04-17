package com.tcc.art.dto.response;

import com.tcc.art.model.CoherenceAnalysis;

import java.time.LocalDateTime;
import java.util.UUID;

public record AnalysisSummaryResponse(
        UUID id,
        Integer score,
        Boolean coherent,
        LocalDateTime createdAt
) {
    public static AnalysisSummaryResponse from(CoherenceAnalysis analysis) {
        return new AnalysisSummaryResponse(
                analysis.getId(),
                analysis.getScore(),
                analysis.getCoherent(),
                analysis.getCreatedAt()
        );
    }
}
