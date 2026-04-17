package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record UpdateProjectRequest(
        @NotBlank String name,
        String address,
        String obraType,
        LocalDate startDate,
        String description
) {}
