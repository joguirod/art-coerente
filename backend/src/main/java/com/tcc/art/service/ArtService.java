package com.tcc.art.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcc.art.dto.request.CreateArtActivityRequest;
import com.tcc.art.dto.request.CreateArtRequest;
import com.tcc.art.dto.response.AnalysisResponse;
import com.tcc.art.dto.response.AnalysisSummaryResponse;
import com.tcc.art.dto.response.ArtResponse;
import com.tcc.art.exception.BusinessRuleException;
import com.tcc.art.exception.ExternalApiException;
import com.tcc.art.exception.ResourceNotFoundException;
import com.tcc.art.model.*;
import com.tcc.art.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ArtService {

    private static final Logger log = LoggerFactory.getLogger(ArtService.class);

    private final ArtRepository artRepository;
    private final ArtActivityRepository activityRepository;
    private final EngineerRepository engineerRepository;
    private final CoherenceAnalysisRepository analysisRepository;
    private final RagService ragService;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ArtService(ArtRepository artRepository,
                      ArtActivityRepository activityRepository,
                      EngineerRepository engineerRepository,
                      CoherenceAnalysisRepository analysisRepository,
                      RagService ragService,
                      GeminiService geminiService,
                      ObjectMapper objectMapper) {
        this.artRepository = artRepository;
        this.activityRepository = activityRepository;
        this.engineerRepository = engineerRepository;
        this.analysisRepository = analysisRepository;
        this.ragService = ragService;
        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<ArtResponse> listByEngineer(UUID engineerId) {
        return artRepository.findByEngineerIdOrderByCreatedAtDesc(engineerId).stream()
                .map(art -> {
                    AnalysisSummaryResponse latest = analysisRepository
                            .findFirstByArtIdOrderByCreatedAtDesc(art.getId())
                            .map(AnalysisSummaryResponse::from)
                            .orElse(null);
                    return ArtResponse.from(art, latest);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public ArtResponse getById(UUID id, UUID engineerId) {
        Art art = findOwned(id, engineerId);
        AnalysisSummaryResponse latest = analysisRepository
                .findFirstByArtIdOrderByCreatedAtDesc(art.getId())
                .map(AnalysisSummaryResponse::from)
                .orElse(null);
        return ArtResponse.from(art, latest);
    }

    @Transactional
    public ArtResponse create(CreateArtRequest request, UUID engineerId) {
        if (request.type() == ArtType.POST
                && (request.artNumber() == null || request.artNumber().isBlank())) {
            throw new BusinessRuleException("Número da ART é obrigatório para ART do tipo Pós-ART.");
        }

        Engineer engineer = engineerRepository.findById(engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("Engenheiro não encontrado."));

        Art art = new Art();
        art.setEngineer(engineer);
        art.setType(request.type());
        art.setArtNumber(request.artNumber());
        art.setDescription(request.description());
        art.setLocation(request.location());
        art.setContractorName(request.contractorName());
        art.setStartDate(request.startDate());
        art.setEndDate(request.endDate());
        artRepository.save(art);
        log.info("ART criada: id={}, tipo={}, engenheiro={}", art.getId(), art.getType(), engineerId);

        for (CreateArtActivityRequest actReq : request.activities()) {
            ArtActivity activity = new ArtActivity();
            activity.setArt(art);
            activity.setAtividade(actReq.atividade());
            activity.setGrupo(actReq.grupo());
            activity.setSubgrupo(actReq.subgrupo());
            activity.setObraServico(actReq.obraServico());
            activity.setComplemento(actReq.complemento());
            activity.setQuantidade(actReq.quantidade());
            activity.setUnidade(actReq.unidade());
            activityRepository.save(activity);
            art.getActivities().add(activity);
        }

        return ArtResponse.from(art, null);
    }

    @Transactional
    public void delete(UUID id, UUID engineerId) {
        Art art = findOwned(id, engineerId);
        if (artRepository.isLinkedToProject(id)) {
            throw new BusinessRuleException("ART vinculada a um projeto. Exclua o projeto primeiro.");
        }
        artRepository.delete(art);
        log.info("ART excluída: id={}, engenheiro={}", id, engineerId);
    }

    @Transactional
    public AnalysisResponse analyze(UUID artId, UUID engineerId) {
        log.info("Solicitação de análise recebida: artId={}, engenheiro={}", artId, engineerId);
        Art art = findOwned(artId, engineerId);

        List<KnowledgeChunk> chunks = ragService.retrieveRelevantChunks(art);
        log.info("RAG: {} chunks recuperados para ART id={}", chunks.size(), artId);
        Map<String, Object> geminiResult = geminiService.analyze(art, chunks);

        CoherenceAnalysis analysis = new CoherenceAnalysis();
        analysis.setArt(art);
        analysis.setScore(((Number) geminiResult.getOrDefault("score", 0)).intValue());
        analysis.setCoherent(Boolean.TRUE.equals(geminiResult.get("coerente")));
        analysis.setSummary((String) geminiResult.getOrDefault("resumo", ""));

        try {
            analysis.setAlerts(objectMapper.writeValueAsString(
                    geminiResult.getOrDefault("alertas", List.of())));
            analysis.setSuggestions(objectMapper.writeValueAsString(
                    geminiResult.getOrDefault("sugestoes", List.of())));
            analysis.setComplementaryRecommendations(objectMapper.writeValueAsString(
                    geminiResult.getOrDefault("recomendacoes_complementares", List.of())));

            // Persist chunk references
            List<Map<String, String>> chunkRefs = chunks.stream()
                    .map(c -> Map.of("source", c.getSource(), "text", c.getChunkText().substring(0, Math.min(200, c.getChunkText().length()))))
                    .toList();
            analysis.setChunksUsed(objectMapper.writeValueAsString(chunkRefs));
        } catch (Exception e) {
            log.error("Falha ao serializar dados da análise para ART id={}: {}", artId, e.getMessage(), e);
            throw new ExternalApiException("Falha ao processar o resultado da análise.");
        }

        analysisRepository.save(analysis);
        log.info("Análise salva: id={}, score={}, coerente={}, artId={}", analysis.getId(), analysis.getScore(), analysis.getCoherent(), artId);
        return AnalysisResponse.from(analysis, objectMapper);
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getAnalysis(UUID artId, UUID engineerId) {
        findOwned(artId, engineerId);
        CoherenceAnalysis analysis = analysisRepository.findFirstByArtIdOrderByCreatedAtDesc(artId)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma análise encontrada para esta ART."));
        return AnalysisResponse.from(analysis, objectMapper);
    }

    private Art findOwned(UUID artId, UUID engineerId) {
        return artRepository.findByIdAndEngineerId(artId, engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("ART não encontrada."));
    }
}
