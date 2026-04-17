package com.tcc.art.repository;

import com.tcc.art.model.Art;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtRepository extends JpaRepository<Art, UUID> {

    List<Art> findByEngineerIdOrderByCreatedAtDesc(UUID engineerId);

    Optional<Art> findByIdAndEngineerId(UUID id, UUID engineerId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p WHERE p.art.id = :artId")
    boolean isLinkedToProject(@Param("artId") UUID artId);

    @Query("SELECT a FROM Art a WHERE a.engineer.id = :engineerId AND a.id NOT IN (SELECT p.art.id FROM Project p WHERE p.art IS NOT NULL)")
    List<Art> findUnlinkedByEngineerId(@Param("engineerId") UUID engineerId);

    long countByEngineerId(UUID engineerId);
}
