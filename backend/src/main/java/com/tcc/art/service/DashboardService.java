package com.tcc.art.service;

import com.tcc.art.dto.response.*;
import com.tcc.art.model.StageStatus;
import com.tcc.art.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final ArtRepository artRepository;
    private final CoherenceAnalysisRepository analysisRepository;
    private final ProjectRepository projectRepository;

    public DashboardService(ArtRepository artRepository,
                            CoherenceAnalysisRepository analysisRepository,
                            ProjectRepository projectRepository) {
        this.artRepository = artRepository;
        this.analysisRepository = analysisRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(UUID engineerId) {
        long totalArts = artRepository.countByEngineerId(engineerId);
        long analyzedArts = analysisRepository.countAnalyzedArtsByEngineerId(engineerId);
        long pendingArts = totalArts - analyzedArts;
        Double averageScore = analysisRepository.findAverageScoreByEngineerId(engineerId);
        long totalProjects = projectRepository.countByEngineerId(engineerId);

        // Recent ARTs (last 5)
        List<ArtResponse> recentArts = artRepository.findByEngineerIdOrderByCreatedAtDesc(engineerId)
                .stream()
                .limit(5)
                .map(art -> {
                    AnalysisSummaryResponse latest = analysisRepository
                            .findFirstByArtIdOrderByCreatedAtDesc(art.getId())
                            .map(AnalysisSummaryResponse::from)
                            .orElse(null);
                    return ArtResponse.from(art, latest);
                })
                .toList();

        // Active projects (not 100% complete, last 5)
        List<ProjectResponse> activeProjects = projectRepository.findByEngineerIdOrderByCreatedAtDesc(engineerId)
                .stream()
                .map(ProjectResponse::from)
                .filter(p -> p.progressPercentage() < 100)
                .limit(5)
                .toList();

        return new DashboardSummaryResponse(
                analyzedArts,
                Math.max(0, pendingArts),
                averageScore,
                totalProjects,
                recentArts,
                activeProjects
        );
    }
}
