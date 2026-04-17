package com.tcc.art.dto.response;

import com.tcc.art.model.KnowledgeChunk;

import java.time.LocalDateTime;
import java.util.UUID;

public record KnowledgeChunkResponse(
        UUID id,
        String source,
        String chunkText,
        boolean active,
        LocalDateTime createdAt
) {
    public static KnowledgeChunkResponse from(KnowledgeChunk chunk) {
        return new KnowledgeChunkResponse(
                chunk.getId(),
                chunk.getSource(),
                chunk.getChunkText(),
                chunk.isActive(),
                chunk.getCreatedAt()
        );
    }
}
