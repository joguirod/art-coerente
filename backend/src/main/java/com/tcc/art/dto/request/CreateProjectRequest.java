package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateProjectRequest(
        @NotBlank String name,
        String address,
        String obraType,
        LocalDate startDate,
        String description,
        UUID artId,
        List<String> stages
) {}
