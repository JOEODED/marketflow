package com.marketflow.common;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;
/** The logged-in user. businessId always comes from here, never from request bodies (tenant isolation). */
public record AuthUser(UUID userId,UUID businessId,String role){public static AuthUser current(){return (AuthUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();}}
