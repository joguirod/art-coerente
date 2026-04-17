package com.tcc.art.repository;

import com.tcc.art.model.KnowledgeChunk;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KnowledgeChunkRepository extends JpaRepository<KnowledgeChunk, UUID> {

    /**
     * Vector similarity search using pgvector cosine distance operator (<=>).
     * Returns top-K most similar active chunks.
     */
    @Query(value = """
            SELECT * FROM knowledge_chunk
            WHERE active = true
            ORDER BY embedding <=> cast(:queryVector AS vector)
            LIMIT :k
            """, nativeQuery = true)
    List<KnowledgeChunk> findTopKSimilar(@Param("queryVector") String queryVector, @Param("k") int k);

    Page<KnowledgeChunk> findAll(Pageable pageable);

    Page<KnowledgeChunk> findBySource(String source, Pageable pageable);

    Page<KnowledgeChunk> findByActive(boolean active, Pageable pageable);

    Page<KnowledgeChunk> findBySourceAndActive(String source, boolean active, Pageable pageable);

    Optional<KnowledgeChunk> findById(UUID id);
}
