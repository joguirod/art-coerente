package com.tcc.art.controller;

import com.tcc.art.dto.request.CreateStageRequest;
import com.tcc.art.dto.request.CreateStageUpdateRequest;
import com.tcc.art.dto.request.ReorderStagesRequest;
import com.tcc.art.dto.request.UpdateStageRequest;
import com.tcc.art.dto.response.StageResponse;
import com.tcc.art.dto.response.StageUpdateResponse;
import com.tcc.art.security.AuthenticatedEngineer;
import com.tcc.art.service.StageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/stages")
public class StageController {

    private final StageService stageService;

    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StageResponse addStage(@PathVariable UUID projectId,
                                  @Valid @RequestBody CreateStageRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        return stageService.addStage(projectId, request, AuthenticatedEngineer.getId(userDetails));
    }

    @PatchMapping("/{stageId}")
    public StageResponse updateStage(@PathVariable UUID projectId,
                                     @PathVariable UUID stageId,
                                     @RequestBody UpdateStageRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return stageService.updateStage(projectId, stageId, request, AuthenticatedEngineer.getId(userDetails));
    }

    @DeleteMapping("/{stageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStage(@PathVariable UUID projectId,
                            @PathVariable UUID stageId,
                            @AuthenticationPrincipal UserDetails userDetails) {
        stageService.deleteStage(projectId, stageId, AuthenticatedEngineer.getId(userDetails));
    }

    @PutMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorderStages(@PathVariable UUID projectId,
                              @Valid @RequestBody ReorderStagesRequest request,
                              @AuthenticationPrincipal UserDetails userDetails) {
        stageService.reorderStages(projectId, request, AuthenticatedEngineer.getId(userDetails));
    }

    @PostMapping("/{stageId}/updates")
    @ResponseStatus(HttpStatus.CREATED)
    public StageUpdateResponse addUpdate(@PathVariable UUID projectId,
                                         @PathVariable UUID stageId,
                                         @RequestParam("description") String description,
                                         @RequestParam(value = "image", required = false) MultipartFile image,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        CreateStageUpdateRequest request = new CreateStageUpdateRequest(description);
        return stageService.addUpdate(projectId, stageId, request, image, AuthenticatedEngineer.getId(userDetails));
    }
}
