package com.tcc.art.service;

import com.tcc.art.dto.request.CreateStageRequest;
import com.tcc.art.dto.request.CreateStageUpdateRequest;
import com.tcc.art.dto.request.ReorderStagesRequest;
import com.tcc.art.dto.request.UpdateStageRequest;
import com.tcc.art.dto.response.StageResponse;
import com.tcc.art.dto.response.StageUpdateResponse;
import com.tcc.art.exception.BusinessRuleException;
import com.tcc.art.exception.ResourceNotFoundException;
import com.tcc.art.model.ConstructionStage;
import com.tcc.art.model.Project;
import com.tcc.art.model.StageUpdate;
import com.tcc.art.repository.ConstructionStageRepository;
import com.tcc.art.repository.ProjectRepository;
import com.tcc.art.repository.StageUpdateRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class StageService {

    private final ProjectRepository projectRepository;
    private final ConstructionStageRepository stageRepository;
    private final StageUpdateRepository updateRepository;
    private final String uploadPath;

    public StageService(ProjectRepository projectRepository,
                        ConstructionStageRepository stageRepository,
                        StageUpdateRepository updateRepository,
                        @Value("${app.upload.path:/uploads}") String uploadPath) {
        this.projectRepository = projectRepository;
        this.stageRepository = stageRepository;
        this.updateRepository = updateRepository;
        this.uploadPath = uploadPath;
    }

    @Transactional
    public StageResponse addStage(UUID projectId, CreateStageRequest request, UUID engineerId) {
        Project project = findOwnedProject(projectId, engineerId);
        int nextOrder = stageRepository.countByProjectId(projectId) + 1;

        ConstructionStage stage = new ConstructionStage();
        stage.setProject(project);
        stage.setName(request.name());
        stage.setStageOrder(nextOrder);
        stageRepository.save(stage);

        return StageResponse.from(stage);
    }

    @Transactional
    public StageResponse updateStage(UUID projectId, UUID stageId, UpdateStageRequest request, UUID engineerId) {
        findOwnedProject(projectId, engineerId);
        ConstructionStage stage = stageRepository.findByIdAndProjectId(stageId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa não encontrada."));

        if (request.name() != null && !request.name().isBlank()) {
            stage.setName(request.name());
        }
        if (request.status() != null) {
            stage.setStatus(request.status());
        }
        stageRepository.save(stage);
        return StageResponse.from(stage);
    }

    @Transactional
    public void deleteStage(UUID projectId, UUID stageId, UUID engineerId) {
        findOwnedProject(projectId, engineerId);
        ConstructionStage stage = stageRepository.findByIdAndProjectId(stageId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa não encontrada."));
        stageRepository.delete(stage);
    }

    @Transactional
    public void reorderStages(UUID projectId, ReorderStagesRequest request, UUID engineerId) {
        findOwnedProject(projectId, engineerId);
        List<UUID> stageIds = request.stageIds();

        for (int i = 0; i < stageIds.size(); i++) {
            UUID stageId = stageIds.get(i);
            ConstructionStage stage = stageRepository.findByIdAndProjectId(stageId, projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Etapa não encontrada: " + stageId));
            stage.setStageOrder(i + 1);
            stageRepository.save(stage);
        }
    }

    @Transactional
    public StageUpdateResponse addUpdate(UUID projectId, UUID stageId,
                                         CreateStageUpdateRequest request,
                                         MultipartFile image,
                                         UUID engineerId) {
        findOwnedProject(projectId, engineerId);
        ConstructionStage stage = stageRepository.findByIdAndProjectId(stageId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Etapa não encontrada."));

        StageUpdate update = new StageUpdate();
        update.setStage(stage);
        update.setDescription(request.description());

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image, stageId);
            update.setImageUrl(imageUrl);
        }

        updateRepository.save(update);
        return StageUpdateResponse.from(update);
    }

    private String saveImage(MultipartFile image, UUID stageId) {
        try {
            Path dir = Paths.get(uploadPath, "stages", stageId.toString());
            Files.createDirectories(dir);

            String originalName = image.getOriginalFilename();
            String ext = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID() + ext;
            Path dest = dir.resolve(filename);
            Files.write(dest, image.getBytes());

            return "/uploads/stages/" + stageId + "/" + filename;
        } catch (IOException e) {
            throw new BusinessRuleException("Falha ao salvar imagem: " + e.getMessage());
        }
    }

    private Project findOwnedProject(UUID projectId, UUID engineerId) {
        return projectRepository.findByIdAndEngineerId(projectId, engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado."));
    }
}
