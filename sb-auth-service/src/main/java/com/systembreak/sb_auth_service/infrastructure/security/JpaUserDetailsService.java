package com.systembreak.sb_auth_service.infrastructure.security;

import com.systembreak.sb_auth_service.domain.model.User;
import com.systembreak.sb_auth_service.infrastructure.adapter.output.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("User is deactivated: " + username);
        }

        // Map the domain model User to Spring Security's UserDetails
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(), // The stored BCrypt hash
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName().name())) // e.g., "ROLE_ADMIN"
                        .collect(Collectors.toList())
        );
    }

    public com.systembreak.sb_auth_service.domain.model.User loadFullUserEntityByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}