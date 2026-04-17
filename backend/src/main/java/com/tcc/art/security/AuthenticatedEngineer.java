package com.tcc.art.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.annotation.*;
import java.util.UUID;

/**
 * Utility to extract the authenticated engineer's UUID from Spring Security context.
 */
public class AuthenticatedEngineer {

    public static UUID getId(UserDetails userDetails) {
        return UUID.fromString(userDetails.getUsername());
    }
}
