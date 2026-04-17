package com.tcc.art.service;

import com.tcc.art.dto.request.CreateProjectRequest;
import com.tcc.art.dto.request.UpdateProjectRequest;
import com.tcc.art.dto.response.ProjectResponse;
import com.tcc.art.exception.ResourceNotFoundException;
import com.tcc.art.model.*;
import com.tcc.art.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private static final List<String> DEFAULT_STAGES = List.of(
            "Serviços preliminares",
            "Fundação",
            "Estrutura",
            "Alvenaria",
            "Instalações hidráulicas",
            "Instalações elétricas",
            "Cobertura",
            "Acabamento"
    );

    private final ProjectRepository projectRepository;
    private final ConstructionStageRepository stageRepository;
    private final EngineerRepository engineerRepository;
    private final ArtRepository artRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ConstructionStageRepository stageRepository,
                          EngineerRepository engineerRepository,
                          ArtRepository artRepository) {
        this.projectRepository = projectRepository;
        this.stageRepository = stageRepository;
        this.engineerRepository = engineerRepository;
        this.artRepository = artRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listByEngineer(UUID engineerId) {
        return projectRepository.findByEngineerIdOrderByCreatedAtDesc(engineerId).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(UUID id, UUID engineerId) {
        Project project = findOwned(id, engineerId);
        return ProjectResponse.from(project);
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request, UUID engineerId) {
        Engineer engineer = engineerRepository.findById(engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("Engenheiro não encontrado."));

        Project project = new Project();
        project.setEngineer(engineer);
        project.setName(request.name());
        project.setAddress(request.address());
        project.setObraType(request.obraType());
        project.setStartDate(request.startDate());
        project.setDescription(request.description());

        if (request.artId() != null) {
            Art art = artRepository.findByIdAndEngineerId(request.artId(), engineerId)
                    .orElseThrow(() -> new ResourceNotFoundException("ART não encontrada."));
            project.setArt(art);
        }

        projectRepository.save(project);
        log.info("Projeto criado: id={}, engenheiro={}", project.getId(), engineerId);

        List<String> stageNames = (request.stages() == null || request.stages().isEmpty())
                ? DEFAULT_STAGES
                : request.stages();

        for (int i = 0; i < stageNames.size(); i++) {
            ConstructionStage stage = new ConstructionStage();
            stage.setProject(project);
            stage.setName(stageNames.get(i));
            stage.setStageOrder(i + 1);
            stage.setStatus(StageStatus.NOT_STARTED);
            stageRepository.save(stage);
            project.getStages().add(stage);
        }

        return ProjectResponse.from(project);
    }

    @Transactional
    public ProjectResponse update(UUID id, UpdateProjectRequest request, UUID engineerId) {
        Project project = findOwned(id, engineerId);
        project.setName(request.name());
        project.setAddress(request.address());
        project.setObraType(request.obraType());
        project.setStartDate(request.startDate());
        project.setDescription(request.description());
        projectRepository.save(project);
        log.info("Projeto atualizado: id={}, engenheiro={}", id, engineerId);
        return ProjectResponse.from(project);
    }

    @Transactional
    public void delete(UUID id, UUID engineerId) {
        Project project = findOwned(id, engineerId);
        projectRepository.delete(project);
        log.info("Projeto excluído: id={}, engenheiro={}", id, engineerId);
    }

    private Project findOwned(UUID id, UUID engineerId) {
        return projectRepository.findByIdAndEngineerId(id, engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado."));
    }
}
