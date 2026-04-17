package com.tcc.art.dto.request;

import com.tcc.art.model.StageStatus;

public record UpdateStageRequest(
        String name,
        StageStatus status
) {}
