package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateStageRequest(
        @NotBlank String name
) {}
