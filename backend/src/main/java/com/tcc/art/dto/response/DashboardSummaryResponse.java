package com.tcc.art.dto.response;

import java.util.List;

public record DashboardSummaryResponse(
        long analyzedArtsCount,
        long pendingArtsCount,
        Double averageScore,
        long activeProjectsCount,
        List<ArtResponse> recentArts,
        List<ProjectResponse> activeProjects
) {}
