CREATE EXTENSION "uuid-ossp";

CREATE TABLE server (
    server_id UUID DEFAULT uuid_generate_v1(),
    nameServer VARCHAR(50) NOT NULL,
    createdBy VARCHAR(50) NOT NULL,
    createdTime TIMESTAMP DEFAULT NOW(),
    lastConnection TIMESTAMP,
    _rev VARCHAR(50),
    UNIQUE(nameServer,createdBy),
    PRIMARY KEY (server_id)
);

CREATE TABLE token (
    server_id UUID,
    token VARCHAR(350),
    FOREIGN kEY (server_id) REFERENCES server(server_id),    
    PRIMARY KEY (server_id)
);

CREATE TABLE users (
    username VARCHAR(50),
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE tracking (
    traking_id UUID DEFAULT uuid_generate_v1(),
    status VARCHAR(50) NOT NULL,
    createdBy VARCHAR(50),
    updateAt TIMESTAMP,
    server_fk UUID, 
    FOREIGN kEY (server_fk) REFERENCES server(server_id),
    PRIMARY KEY (traking_id)
);


CREATE TABLE payMethod(
    pay_method_id SERIAL,
    method VARCHAR(50),
    epiration_month VARCHAR(50),
    expiration_year VARCHAR(50),
    number VARCHAR(50),
    type VARCHAR(50),
    _rev VARCHAR(50),
    PRIMARY KEY (pay_method_id)
);

CREATE TABLE payment(
    transaction_id UUID DEFAULT uuid_generate_v1(),
    currency VARCHAR(50),
    value FLOAT NOT NULL,
    pay_method_fk SERIAL,
    server_fk UUID, 
    FOREIGN kEY (server_fk) REFERENCES server(server_id),
    FOREIGN kEY (pay_method_fk) REFERENCES payMethod(pay_method_id),
    PRIMARY KEY (transaction_id)
);
