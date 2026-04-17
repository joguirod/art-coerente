package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateStageUpdateRequest(
        @NotBlank String description
) {}
