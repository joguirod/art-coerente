package com.tcc.art.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public record ReorderStagesRequest(
        @NotEmpty List<UUID> stageIds
) {}
