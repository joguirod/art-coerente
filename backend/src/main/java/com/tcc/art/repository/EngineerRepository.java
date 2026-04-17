package com.tcc.art.repository;

import com.tcc.art.model.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EngineerRepository extends JpaRepository<Engineer, UUID> {

    Optional<Engineer> findByEmail(String email);

    Optional<Engineer> findByUsername(String username);

    Optional<Engineer> findByEmailOrUsername(String email, String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
