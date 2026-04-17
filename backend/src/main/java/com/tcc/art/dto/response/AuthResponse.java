package com.tcc.art.dto.response;

public record AuthResponse(
        String token,
        EngineerResponse engineer
) {}
