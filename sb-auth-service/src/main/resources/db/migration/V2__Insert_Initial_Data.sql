-- Insert Roles
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', 'System Administrator');
INSERT INTO roles (name, description) VALUES ('ROLE_USER', 'Standard User');

-- Insert Test User (Password 'testpassword' BCrypt encoded)
-- NOTE: You must generate a BCrypt hash for the actual password you want to use.
-- For this example, we'll use a placeholder.
INSERT INTO users (id, username, password, email) VALUES
    (gen_random_uuid(), 'admin', '$2a$10$wYF3g1N4pXz9cZ8J1Q2Y8O/t1/o0W4zK/h0X3yQ4sT5zL7R8j9A.', 'admin@systembreak.com');

-- Assign ROLE_ADMIN to the test user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';