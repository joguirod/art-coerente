package com.tcc.art.security;

import com.tcc.art.model.Engineer;
import com.tcc.art.repository.EngineerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EngineerRepository engineerRepository;

    public UserDetailsServiceImpl(EngineerRepository engineerRepository) {
        this.engineerRepository = engineerRepository;
    }

    // Called with engineerId (UUID as string) from JWT filter
    @Override
    public UserDetails loadUserByUsername(String engineerIdStr) throws UsernameNotFoundException {
        UUID engineerId = UUID.fromString(engineerIdStr);
        Engineer engineer = engineerRepository.findById(engineerId)
                .orElseThrow(() -> new UsernameNotFoundException("Engineer not found: " + engineerIdStr));

        return new User(
                engineer.getId().toString(),
                engineer.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_ENGINEER"))
        );
    }

    // Helper used in auth
    public UserDetails loadByEmailOrUsername(String emailOrUsername) throws UsernameNotFoundException {
        Engineer engineer = engineerRepository.findByEmailOrUsername(emailOrUsername, emailOrUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Engineer not found: " + emailOrUsername));

        return new User(
                engineer.getId().toString(),
                engineer.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_ENGINEER"))
        );
    }
}
