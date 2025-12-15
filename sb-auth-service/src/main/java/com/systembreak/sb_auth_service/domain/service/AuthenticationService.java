package com.systembreak.sb_auth_service.domain.service;

import com.systembreak.sb_auth_service.domain.port.input.AuthenticationPort;
import com.systembreak.sb_auth_service.domain.port.output.TokenPersistencePort;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginRequest;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginResponse;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.UserResponse;
import com.systembreak.sb_auth_service.infrastructure.security.JwtService;
import com.systembreak.sb_auth_service.infrastructure.security.JpaUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements AuthenticationPort {

    private final AuthenticationManager authenticationManager;
    private final JpaUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final TokenPersistencePort tokenPersistencePort;

    // Helper method to retrieve user info (Roles and Permissions)
    private UserResponse buildUserResponse(UserDetails userDetails) {
        // En este servicio solo se tienen roles. Si se implementa la tabla role_permissions [65],
        // se debería obtener la lista de permisos aquí.
        List<String> roles = userDetails.getAuthorities().stream()
                .filter(a -> a instanceof SimpleGrantedAuthority)
                .map(a -> a.getAuthority().replace("ROLE_", "")) // Quita el prefijo "ROLE_"
                .collect(Collectors.toList());

        // Dejamos la lista de permisos vacía o con placeholders por ahora,
        // ya que la estructura del dominio no incluye la tabla de permisos [65].
        List<String> permissions = List.of();

        // Para obtener el ID, necesitamos acceder al objeto User completo,
        // lo cual Spring Security no expone directamente en UserDetails estándar.
        // Asumiremos que el ID del usuario se recupera por separado o se inyecta.
        // Temporalmente, usaremos un UUID estático o un servicio de apoyo,
        // pero la mejor práctica es cargar la entidad completa si se requiere el ID.
        // Para simplificar, obtenemos el ID del UserDetails si es posible, o lo resolvemos después.

        // Usaremos getAuthenticatedUser() para obtener todos los datos.
        return getAuthenticatedUser(userDetails.getUsername());
    }

    /**
     * 1.1 Login: Authenticates user and generates both Access and Refresh tokens [7, 8].
     */
    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. Authenticate using Spring Security [8, 16, 17]
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // 2. Load UserDetails (already loads roles/permissions via JpaUserDetailsService)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Generate tokens [19, 20]
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // 4. Build response
        UserResponse userResponse = buildUserResponse(userDetails);

        return new LoginResponse(accessToken, refreshToken, userResponse);
    }

    /**
     * 1.2 Logout: Revokes the refresh token by storing it in the revoked tokens table [32].
     */
    @Override
    @Transactional
    public void logout(String refreshToken) {
        // Validación JWT es implícita al extraer el username (si falla, lanza excepción)
        jwtService.extractUsername(refreshToken);

        // Revoke the token [32]
        tokenPersistencePort.revokeToken(refreshToken);
    }

    /**
     * 1.3 Refresh Token: Generates a new access token from a valid refresh token [43].
     */
    @Override
    public String refreshToken(String refreshToken) {
        // 1. Validation: Check if the token is revoked [45]
        if (tokenPersistencePort.isTokenRevoked(refreshToken)) {
            throw new IllegalArgumentException("Refresh token is revoked.");
        }

        // 2. Validation: Check if the token is valid (not expired, correct signature) [47]
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Refresh token is invalid or expired.");
        }

        // 3. Generate new Access Token [43]
        return jwtService.generateToken(userDetails);
    }

    /**
     * 1.4 Get authenticated user data [52, 53].
     * Note: This relies on JpaUserDetailsService which only returns standard UserDetails.
     * We assume this method is called after successful authentication.
     */
    @Override
    public UserResponse getAuthenticatedUser(String username) {
        // Asegúrate que esta dependencia esté inyectada en el constructor:
        // private final JpaUserDetailsService userDetailsService;

        com.systembreak.sb_auth_service.domain.model.User userEntity =
                userDetailsService.loadFullUserEntityByUsername(username);

        List<String> roles = userEntity.getRoles().stream()
                // Mapeo corregido: obtiene la cadena del nombre del Rol
                .map(role -> role.getName().name().replace("ROLE_", ""))
                .collect(Collectors.toList());

        List<String> permissions = List.of(); // Placeholder, o lógica de la tabla role_permissions

        return new UserResponse(
                userEntity.getId(),
                userEntity.getUsername(),
                roles,
                permissions
        );
    }
}