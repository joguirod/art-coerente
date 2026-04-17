package com.tcc.art.dto.response;

import com.tcc.art.model.StageUpdate;

import java.time.LocalDateTime;
import java.util.UUID;

public record StageUpdateResponse(
        UUID id,
        String description,
        String imageUrl,
        LocalDateTime createdAt
) {
    public static StageUpdateResponse from(StageUpdate u) {
        return new StageUpdateResponse(u.getId(), u.getDescription(), u.getImageUrl(), u.getCreatedAt());
    }
}
