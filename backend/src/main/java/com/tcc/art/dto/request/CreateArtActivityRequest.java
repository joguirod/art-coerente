package com.tcc.art.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateArtActivityRequest(
        @NotBlank String atividade,
        @NotBlank String grupo,
        @NotBlank String subgrupo,
        @NotBlank String obraServico,
        String complemento,
        @NotNull @DecimalMin("0.01") BigDecimal quantidade,
        @NotBlank String unidade
) {}
