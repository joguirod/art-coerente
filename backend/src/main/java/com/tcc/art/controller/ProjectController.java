package com.tcc.art.controller;

import com.tcc.art.dto.request.CreateProjectRequest;
import com.tcc.art.dto.request.UpdateProjectRequest;
import com.tcc.art.dto.response.ProjectResponse;
import com.tcc.art.security.AuthenticatedEngineer;
import com.tcc.art.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> list(@AuthenticationPrincipal UserDetails userDetails) {
        return projectService.listByEngineer(AuthenticatedEngineer.getId(userDetails));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody CreateProjectRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        return projectService.create(request, AuthenticatedEngineer.getId(userDetails));
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable UUID id,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        return projectService.getById(id, AuthenticatedEngineer.getId(userDetails));
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable UUID id,
                                  @Valid @RequestBody UpdateProjectRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        return projectService.update(id, request, AuthenticatedEngineer.getId(userDetails));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id,
                       @AuthenticationPrincipal UserDetails userDetails) {
        projectService.delete(id, AuthenticatedEngineer.getId(userDetails));
    }
}
