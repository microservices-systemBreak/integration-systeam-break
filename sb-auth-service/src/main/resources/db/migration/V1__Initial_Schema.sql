-- Ensure uuid generation function is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
                       id UUID NOT NULL,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(100) NOT NULL,
                       email VARCHAR(100) NOT NULL,
                       is_active BOOLEAN DEFAULT TRUE,
                       PRIMARY KEY (id)
);

CREATE TABLE roles (
                       id BIGSERIAL NOT NULL,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(255),
                       PRIMARY KEY (id)
);

CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id BIGINT NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE tokens_revoked (
                                id UUID NOT NULL,
                                token VARCHAR(500) NOT NULL,
                                revoked_at TIMESTAMP NOT NULL,
                                PRIMARY KEY (id)
);