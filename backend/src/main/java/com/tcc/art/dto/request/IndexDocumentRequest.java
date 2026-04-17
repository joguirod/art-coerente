package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotBlank;

public record IndexDocumentRequest(
        @NotBlank String source,
        @NotBlank String text
) {}
