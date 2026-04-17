package com.tcc.art.repository;

import com.tcc.art.model.ArtActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArtActivityRepository extends JpaRepository<ArtActivity, UUID> {

    List<ArtActivity> findByArtId(UUID artId);
}
