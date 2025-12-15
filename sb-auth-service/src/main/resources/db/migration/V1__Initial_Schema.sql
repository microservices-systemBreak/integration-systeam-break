-- Table users [cite: 77]
CREATE TABLE users (
                       id BINARY(16) NOT NULL,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(100) NOT NULL,
                       email VARCHAR(100) NOT NULL,
                       is_active BOOLEAN DEFAULT TRUE,
                       PRIMARY KEY (id)
);

-- Table roles [cite: 78]
CREATE TABLE roles (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(255),
                       PRIMARY KEY (id)
);

-- Table user_roles (Many-to-Many) [cite: 79]
CREATE TABLE user_roles (
                            user_id BINARY(16) NOT NULL,
                            role_id BIGINT NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table tokens_revoked [cite: 72]
CREATE TABLE tokens_revoked (
                                id BINARY(16) NOT NULL,
                                token VARCHAR(500) NOT NULL,
                                revoked_at DATETIME NOT NULL,
                                PRIMARY KEY (id)
);