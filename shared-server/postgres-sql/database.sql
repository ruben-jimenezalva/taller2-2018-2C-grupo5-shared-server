CREATE EXTENSION "uuid-ossp";

CREATE TABLE server (
    server_id UUID DEFAULT uuid_generate_v1(),
    nameServer VARCHAR(50) NOT NULL,
    createdBy VARCHAR(50) NOT NULL,
    createdTime TIMESTAMP DEFAULT NOW(),
    lastConnection TIMESTAMP DEFAULT NOW(),
    _rev VARCHAR(50),
    jti VARCHAR(50),
    UNIQUE(nameServer,createdBy),
    PRIMARY KEY (server_id)
);

CREATE TABLE blackListToken (
    jti VARCHAR(50)
);

CREATE TABLE users (
    username VARCHAR(50),
    password VARCHAR(64) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE tracking (
    tracking_id UUID DEFAULT uuid_generate_v1(),
    status VARCHAR(50) NOT NULL,
    updateAt TIMESTAMP DEFAULT NOW(),
    server_fk UUID, 
    FOREIGN kEY (server_fk) REFERENCES server(server_id),
    PRIMARY KEY (tracking_id)
);

CREATE TABLE payment(
    transaction_id UUID DEFAULT uuid_generate_v1(),
    currency VARCHAR(50),
    value FLOAT NOT NULL,
    server_fk UUID NOT NULL,
    method VARCHAR(50),
    expiration_month VARCHAR(50),
    expiration_year VARCHAR(50),
    number VARCHAR(50),
    type VARCHAR(50),
    FOREIGN kEY (server_fk) REFERENCES server(server_id),
    PRIMARY KEY (transaction_id)
);
