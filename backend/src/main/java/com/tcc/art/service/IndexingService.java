package com.tcc.art.service;

import com.tcc.art.model.KnowledgeChunk;
import com.tcc.art.repository.KnowledgeChunkRepository;
import com.tcc.art.util.ChunkingUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IndexingService {

    private final ChunkingUtil chunkingUtil;
    private final EmbeddingService embeddingService;
    private final KnowledgeChunkRepository chunkRepository;

    public IndexingService(ChunkingUtil chunkingUtil,
                           EmbeddingService embeddingService,
                           KnowledgeChunkRepository chunkRepository) {
        this.chunkingUtil = chunkingUtil;
        this.embeddingService = embeddingService;
        this.chunkRepository = chunkRepository;
    }

    /**
     * Chunks text, generates embeddings, and persists to knowledge_chunk table.
     * Indexing is additive — existing chunks are not removed.
     */
    @Transactional
    public int indexDocument(String source, String text) {
        List<String> chunks = chunkingUtil.chunk(text);
        int indexed = 0;

        for (String chunkText : chunks) {
            float[] embedding = embeddingService.embed(chunkText);

            KnowledgeChunk chunk = new KnowledgeChunk();
            chunk.setSource(source);
            chunk.setChunkText(chunkText);
            chunk.setEmbedding(embedding);
            chunk.setActive(true);
            chunkRepository.save(chunk);
            indexed++;
        }

        return indexed;
    }
}
