package com.tcc.art.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coherence_analysis")
public class CoherenceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_id", nullable = false)
    private Art art;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Boolean coherent;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String alerts;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String suggestions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "complementary_recommendations", columnDefinition = "jsonb")
    private String complementaryRecommendations;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "chunks_used", columnDefinition = "jsonb")
    private String chunksUsed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public CoherenceAnalysis() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Art getArt() { return art; }
    public void setArt(Art art) { this.art = art; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Boolean getCoherent() { return coherent; }
    public void setCoherent(Boolean coherent) { this.coherent = coherent; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getAlerts() { return alerts; }
    public void setAlerts(String alerts) { this.alerts = alerts; }

    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }

    public String getComplementaryRecommendations() { return complementaryRecommendations; }
    public void setComplementaryRecommendations(String complementaryRecommendations) { this.complementaryRecommendations = complementaryRecommendations; }

    public String getChunksUsed() { return chunksUsed; }
    public void setChunksUsed(String chunksUsed) { this.chunksUsed = chunksUsed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
