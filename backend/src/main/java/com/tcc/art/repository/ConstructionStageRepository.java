package com.tcc.art.repository;

import com.tcc.art.model.ConstructionStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConstructionStageRepository extends JpaRepository<ConstructionStage, UUID> {

    List<ConstructionStage> findByProjectIdOrderByStageOrderAsc(UUID projectId);

    Optional<ConstructionStage> findByIdAndProjectId(UUID id, UUID projectId);

    int countByProjectId(UUID projectId);
}
