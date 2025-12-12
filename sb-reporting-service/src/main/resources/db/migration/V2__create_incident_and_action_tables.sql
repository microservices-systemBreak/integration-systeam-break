CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT,
    type VARCHAR(255),
    description TEXT,
    detected_at TIMESTAMP,
    CONSTRAINT fk_device
        FOREIGN KEY(device_id)
        REFERENCES devices(id)
);

CREATE TABLE actions (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(255),
    parameters TEXT,
    status VARCHAR(255),
    executed_at TIMESTAMP
);
