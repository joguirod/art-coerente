package com.tcc.art.repository;

import com.tcc.art.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByEngineerIdOrderByCreatedAtDesc(UUID engineerId);

    Optional<Project> findByIdAndEngineerId(UUID id, UUID engineerId);

    long countByEngineerId(UUID engineerId);
}
