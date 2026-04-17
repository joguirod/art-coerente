package com.tcc.art.dto.request;

import com.tcc.art.model.ArtType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record CreateArtRequest(
        @NotNull ArtType type,
        String artNumber,
        @NotBlank String description,
        @NotBlank String location,
        @NotBlank String contractorName,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotEmpty @Valid List<CreateArtActivityRequest> activities
) {}
