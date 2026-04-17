package com.tcc.art.repository;

import com.tcc.art.model.CoherenceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CoherenceAnalysisRepository extends JpaRepository<CoherenceAnalysis, UUID> {

    List<CoherenceAnalysis> findByArtIdOrderByCreatedAtDesc(UUID artId);

    Optional<CoherenceAnalysis> findFirstByArtIdOrderByCreatedAtDesc(UUID artId);

    @Query("SELECT AVG(ca.score) FROM CoherenceAnalysis ca WHERE ca.art.engineer.id = :engineerId")
    Double findAverageScoreByEngineerId(@Param("engineerId") UUID engineerId);

    @Query("SELECT COUNT(DISTINCT ca.art.id) FROM CoherenceAnalysis ca WHERE ca.art.engineer.id = :engineerId")
    long countAnalyzedArtsByEngineerId(@Param("engineerId") UUID engineerId);
}
