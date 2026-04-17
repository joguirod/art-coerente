package com.tcc.art.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "art")
public class Art {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private Engineer engineer;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "art_type")
    private ArtType type;

    @Column(name = "art_number", length = 50)
    private String artNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "contractor_name", nullable = false, length = 255)
    private String contractorName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "pdf_path", length = 500)
    private String pdfPath;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "art", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ArtActivity> activities = new ArrayList<>();

    @OneToMany(mappedBy = "art", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CoherenceAnalysis> analyses = new ArrayList<>();

    public Art() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Engineer getEngineer() { return engineer; }
    public void setEngineer(Engineer engineer) { this.engineer = engineer; }

    public ArtType getType() { return type; }
    public void setType(ArtType type) { this.type = type; }

    public String getArtNumber() { return artNumber; }
    public void setArtNumber(String artNumber) { this.artNumber = artNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContractorName() { return contractorName; }
    public void setContractorName(String contractorName) { this.contractorName = contractorName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<ArtActivity> getActivities() { return activities; }
    public void setActivities(List<ArtActivity> activities) { this.activities = activities; }

    public List<CoherenceAnalysis> getAnalyses() { return analyses; }
    public void setAnalyses(List<CoherenceAnalysis> analyses) { this.analyses = analyses; }
}
