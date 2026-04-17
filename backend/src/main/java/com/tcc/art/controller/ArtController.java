package com.tcc.art.controller;

import com.tcc.art.dto.request.CreateArtRequest;
import com.tcc.art.dto.response.AnalysisResponse;
import com.tcc.art.dto.response.ArtResponse;
import com.tcc.art.dto.response.PdfExtractionResponse;
import com.tcc.art.security.AuthenticatedEngineer;
import com.tcc.art.service.ArtService;
import com.tcc.art.service.PdfExtractorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/arts")
public class ArtController {

    private final ArtService artService;
    private final PdfExtractorService pdfExtractorService;

    public ArtController(ArtService artService, PdfExtractorService pdfExtractorService) {
        this.artService = artService;
        this.pdfExtractorService = pdfExtractorService;
    }

    @GetMapping
    public List<ArtResponse> list(@AuthenticationPrincipal UserDetails userDetails) {
        return artService.listByEngineer(AuthenticatedEngineer.getId(userDetails));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArtResponse create(@Valid @RequestBody CreateArtRequest request,
                              @AuthenticationPrincipal UserDetails userDetails) {
        return artService.create(request, AuthenticatedEngineer.getId(userDetails));
    }

    @GetMapping("/{id}")
    public ArtResponse getById(@PathVariable UUID id,
                               @AuthenticationPrincipal UserDetails userDetails) {
        return artService.getById(id, AuthenticatedEngineer.getId(userDetails));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id,
                       @AuthenticationPrincipal UserDetails userDetails) {
        artService.delete(id, AuthenticatedEngineer.getId(userDetails));
    }

    @PostMapping("/{id}/analyze")
    public AnalysisResponse analyze(@PathVariable UUID id,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return artService.analyze(id, AuthenticatedEngineer.getId(userDetails));
    }

    @GetMapping("/{id}/analysis")
    public AnalysisResponse getAnalysis(@PathVariable UUID id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        return artService.getAnalysis(id, AuthenticatedEngineer.getId(userDetails));
    }

    @PostMapping("/extract-pdf")
    public PdfExtractionResponse extractPdf(@RequestParam("file") MultipartFile file) {
        return pdfExtractorService.extract(file);
    }
}
