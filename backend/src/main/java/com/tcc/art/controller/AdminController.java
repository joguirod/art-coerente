package com.tcc.art.controller;

import com.tcc.art.dto.request.IndexDocumentRequest;
import com.tcc.art.dto.response.KnowledgeChunkResponse;
import com.tcc.art.exception.ResourceNotFoundException;
import com.tcc.art.model.KnowledgeChunk;
import com.tcc.art.repository.KnowledgeChunkRepository;
import com.tcc.art.service.IndexingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final IndexingService indexingService;
    private final KnowledgeChunkRepository chunkRepository;

    public AdminController(IndexingService indexingService, KnowledgeChunkRepository chunkRepository) {
        this.indexingService = indexingService;
        this.chunkRepository = chunkRepository;
    }

    @PostMapping("/index")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, Object>> indexDocument(@Valid @RequestBody IndexDocumentRequest request) {
        int count = indexingService.indexDocument(request.source(), request.text());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Indexação concluída.", "chunksIndexed", count));
    }

    @GetMapping("/chunks")
    public Page<KnowledgeChunkResponse> listChunks(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<KnowledgeChunk> chunks;
        if (source != null && active != null) {
            chunks = chunkRepository.findBySourceAndActive(source, active, pageable);
        } else if (source != null) {
            chunks = chunkRepository.findBySource(source, pageable);
        } else if (active != null) {
            chunks = chunkRepository.findByActive(active, pageable);
        } else {
            chunks = chunkRepository.findAll(pageable);
        }

        return chunks.map(KnowledgeChunkResponse::from);
    }

    @PatchMapping("/chunks/{id}")
    public KnowledgeChunkResponse toggleChunk(@PathVariable UUID id,
                                               @RequestBody Map<String, Boolean> body) {
        KnowledgeChunk chunk = chunkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chunk não encontrado."));
        Boolean active = body.get("active");
        if (active != null) {
            chunk.setActive(active);
            chunkRepository.save(chunk);
        }
        return KnowledgeChunkResponse.from(chunk);
    }
}
