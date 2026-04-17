package com.tcc.art.dto.response;

import com.tcc.art.model.ConstructionStage;
import com.tcc.art.model.StageStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StageResponse(
        UUID id,
        String name,
        Integer stageOrder,
        StageStatus status,
        LocalDateTime updatedAt,
        List<StageUpdateResponse> updates
) {
    public static StageResponse from(ConstructionStage s) {
        return new StageResponse(
                s.getId(),
                s.getName(),
                s.getStageOrder(),
                s.getStatus(),
                s.getUpdatedAt(),
                s.getUpdates().stream().map(StageUpdateResponse::from).toList()
        );
    }
}
