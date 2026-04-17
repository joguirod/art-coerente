package com.tcc.art.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private Engineer engineer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_id")
    private Art art;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String address;

    @Column(name = "obra_type", length = 100)
    private String obraType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("stageOrder ASC")
    private List<ConstructionStage> stages = new ArrayList<>();

    public Project() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Engineer getEngineer() { return engineer; }
    public void setEngineer(Engineer engineer) { this.engineer = engineer; }

    public Art getArt() { return art; }
    public void setArt(Art art) { this.art = art; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getObraType() { return obraType; }
    public void setObraType(String obraType) { this.obraType = obraType; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<ConstructionStage> getStages() { return stages; }
    public void setStages(List<ConstructionStage> stages) { this.stages = stages; }
}
