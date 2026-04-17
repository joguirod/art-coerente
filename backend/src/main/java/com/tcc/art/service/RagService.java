package com.tcc.art.service;

import com.tcc.art.model.Art;
import com.tcc.art.model.KnowledgeChunk;
import com.tcc.art.repository.KnowledgeChunkRepository;
import com.tcc.art.util.FloatArrayToVectorConverter;
import com.tcc.art.util.PromptBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RagService {

    private final KnowledgeChunkRepository chunkRepository;
    private final EmbeddingService embeddingService;
    private final PromptBuilder promptBuilder;
    private final int topK;

    public RagService(KnowledgeChunkRepository chunkRepository,
                      EmbeddingService embeddingService,
                      PromptBuilder promptBuilder,
                      @Value("${app.rag.top-k:5}") int topK) {
        this.chunkRepository = chunkRepository;
        this.embeddingService = embeddingService;
        this.promptBuilder = promptBuilder;
        this.topK = topK;
    }

    /**
     * Retrieves the most semantically relevant knowledge chunks for the given ART.
     */
    @Transactional(readOnly = true)
    public List<KnowledgeChunk> retrieveRelevantChunks(Art art) {
        String queryText = promptBuilder.buildQueryText(art);
        float[] embedding = embeddingService.embed(queryText);
        String vectorString = FloatArrayToVectorConverter.toVectorString(embedding);
        return chunkRepository.findTopKSimilar(vectorString, topK);
    }
}
