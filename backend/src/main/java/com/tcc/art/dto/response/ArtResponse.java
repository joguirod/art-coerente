package com.tcc.art.dto.response;

import com.tcc.art.model.Art;
import com.tcc.art.model.ArtType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ArtResponse(
        UUID id,
        ArtType type,
        String artNumber,
        String description,
        String location,
        String contractorName,
        LocalDate startDate,
        LocalDate endDate,
        String pdfPath,
        LocalDateTime createdAt,
        List<ArtActivityResponse> activities,
        AnalysisSummaryResponse latestAnalysis
) {
    public static ArtResponse from(Art art, AnalysisSummaryResponse latestAnalysis) {
        return new ArtResponse(
                art.getId(),
                art.getType(),
                art.getArtNumber(),
                art.getDescription(),
                art.getLocation(),
                art.getContractorName(),
                art.getStartDate(),
                art.getEndDate(),
                art.getPdfPath(),
                art.getCreatedAt(),
                art.getActivities().stream().map(ArtActivityResponse::from).toList(),
                latestAnalysis
        );
    }
}
