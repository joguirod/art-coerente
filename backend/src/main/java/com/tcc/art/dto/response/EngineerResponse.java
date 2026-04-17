package com.tcc.art.dto.response;

import com.tcc.art.model.Engineer;

import java.util.UUID;

public record EngineerResponse(
        UUID id,
        String name,
        String email,
        String username
) {
    public static EngineerResponse from(Engineer engineer) {
        return new EngineerResponse(
                engineer.getId(),
                engineer.getName(),
                engineer.getEmail(),
                engineer.getUsername()
        );
    }
}
