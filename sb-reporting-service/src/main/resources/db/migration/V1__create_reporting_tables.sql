CREATE TABLE IF NOT EXISTS devices (
    id BIGSERIAL PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL UNIQUE,
    hostname VARCHAR(255),
    ip_address VARCHAR(255),
    operating_system VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scans (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL,
    scan_correlation_id VARCHAR(255) NOT NULL,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    status VARCHAR(50),
    overall_severity VARCHAR(50),
    total_packages INT,
    vulnerable_packages INT,
    raw_report TEXT,
    CONSTRAINT fk_scans_device
        FOREIGN KEY (device_id)
        REFERENCES devices (id)
        ON DELETE CASCADE
);
