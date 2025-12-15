package com.systembreak.sb_auth_service.domain.port.input;

import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginRequest;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.LoginResponse;
import com.systembreak.sb_auth_service.infrastructure.adapter.input.dto.UserResponse;

public interface AuthenticationPort {

    // 1.1 Login [6]
    LoginResponse login(LoginRequest request);

    // 1.2 Logout [30]. Función: Revocar el refresh Token recibido [32]
    void logout(String refreshToken);

    // 1.3 Refresh Token [41]. Función: Generar un nuevo accessToken [43]
    String refreshToken(String refreshToken);

    // 1.4 Obtener datos del usuario [51]
    UserResponse getAuthenticatedUser(String username);
}
