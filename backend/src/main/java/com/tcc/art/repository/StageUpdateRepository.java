package com.tcc.art.repository;

import com.tcc.art.model.StageUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StageUpdateRepository extends JpaRepository<StageUpdate, UUID> {

    List<StageUpdate> findByStageIdOrderByCreatedAtAsc(UUID stageId);
}
