package com.systembreak.sb_auth_service.infrastructure.adapter.input;

import com.systembreak.sb_auth_service.domain.port.input.AuthenticationPort;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginRequest;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginResponse;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.RefreshTokenRequest;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth") // Base Endpoint [7]
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationPort authenticationPort;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    /**
     * 1.1 Login: POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        logger.info("-> Petición de Login recibida para el usuario: {}", request.username());
        try {
            LoginResponse response = authenticationPort.login(request);
            logger.info("<- Login exitoso para el usuario: {}", request.username());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            logger.error("<- Error de Credenciales para {}: {}", request.username(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password [29]: " + e.getMessage());
            // Captura genérica si algo más falla antes de tiempo
        } catch (Exception e) {
            logger.error("<- Error GENÉRICO durante Login para {}: {}", request.username(), e.getMessage(), e);
            // Error handling for Authentication failure (User not found, bad credentials) [29]
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Internal server error during login");
        }
    }

    /**
     * 1.2 Logout: POST /auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody RefreshTokenRequest request) {
        try {
            authenticationPort.logout(request.refreshToken());
            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            // Assuming 400 Bad Request if the token format is invalid or general error
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * 1.3 Refresh Token: POST /auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String newAccessToken = authenticationPort.refreshToken(request.refreshToken());
            // Response: { "accessToken": "NEW_JWT_TOKEN" } [49]
            return ResponseEntity.ok("{\"accessToken\":\"" + newAccessToken + "\"}");
        } catch (IllegalArgumentException e) {
            // Catches token revoked or invalid/expired [45, 47]
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    /**
     * 1.4 Get User Data: GET /auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getAuthenticatedUser(@AuthenticationPrincipal UserDetails userDetails) {
        // @AuthenticationPrincipal is populated by JwtAuthenticationFilter
        // The username is guaranteed to be valid at this point.
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        UserResponse response = authenticationPort.getAuthenticatedUser(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
