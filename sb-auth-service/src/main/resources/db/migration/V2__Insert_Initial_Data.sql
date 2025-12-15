-- Insert Roles
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', 'System Administrator');
INSERT INTO roles (name, description) VALUES ('ROLE_USER', 'Standard User');

-- Insert Test User (Password 'systemBreak2026' BCrypt encoded)
-- NOTE: You must generate a BCrypt hash for the actual password you want to use.
-- For this example, we'll use a placeholder.
INSERT INTO users (id, username, password, email) VALUES
    (UUID_TO_BIN(UUID()), 'admin', '$2a$10$HSPR0Z4dVTArIIN.sxkWtOB3rTg3W93uRipcXdOWvVahApgdn0/wK', 'admin@systembreak.com');

-- Assign ROLE_ADMIN to the test user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';