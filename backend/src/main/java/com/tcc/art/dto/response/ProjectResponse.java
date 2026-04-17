package com.tcc.art.dto.response;

import com.tcc.art.model.Project;
import com.tcc.art.model.StageStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String name,
        String address,
        String obraType,
        LocalDate startDate,
        String description,
        UUID artId,
        LocalDateTime createdAt,
        List<StageResponse> stages,
        int progressPercentage
) {
    public static ProjectResponse from(Project project) {
        List<StageResponse> stages = project.getStages().stream().map(StageResponse::from).toList();

        int total = stages.size();
        long completed = project.getStages().stream()
                .filter(s -> s.getStatus() == StageStatus.COMPLETED)
                .count();
        int progress = total == 0 ? 0 : (int) Math.round((double) completed / total * 100);

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getAddress(),
                project.getObraType(),
                project.getStartDate(),
                project.getDescription(),
                project.getArt() != null ? project.getArt().getId() : null,
                project.getCreatedAt(),
                stages,
                progress
        );
    }
}
