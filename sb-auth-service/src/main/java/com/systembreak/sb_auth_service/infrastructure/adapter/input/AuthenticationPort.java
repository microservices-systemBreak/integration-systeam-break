package com.systembreak.sb_auth_service.infrastructure.adapter.input;

import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginRequest;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginResponse;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.UserResponse;

public interface AuthenticationPort {

    // 1.1 Login [cite: 6]
    LoginResponse login(LoginRequest request);

    // 1.2 Logout[cite: 30]. Función: Revocar el refresh Token recibido [cite: 32]
    void logout(String refreshToken);

    // 1.3 Refresh Token[cite: 41]. Función: Generar un nuevo accessToken [cite: 43]
    String refreshToken(String refreshToken);

    // 1.4 Obtener datos del usuario [cite: 51]
    UserResponse getAuthenticatedUser(String username);
}