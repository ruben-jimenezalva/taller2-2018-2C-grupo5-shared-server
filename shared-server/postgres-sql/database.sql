CREATE DATABASE services_db;

CREATE TABLE servers (
    server_id SERIAL,
    nameServer VARCHAR(50),
    createdBy VARCHAR(50),
    createdTime TIMESTAMP DEFAULT NOW(),
    lastConnection TIMESTAMP,
    _rev VARCHAR(50),
    PRIMARY KEY (server_id)
);

CREATE TABLE users (
    user_id SERIAL,
    username VARCHAR(50),
    password VARCHAR(50),
    PRIMARY KEY (user_id)
);

CREATE TABLE tracking (
    traking_id SERIAL,
    status VARCHAR(50),
    createdBy VARCHAR(50),
    updateAt TIMESTAMP,
    PRIMARY KEY (traking_id)
);


CREATE TABLE payMethod(
    pay_method_id SERIAL,
    epiration_month VARCHAR(50),
    expiration_year VARCHAR(50),
    method VARCHAR(50),
    number VARCHAR(50),
    type VARCHAR(50),
    _rev VARCHAR(50),
    PRIMARY KEY (pay_method_id)
);

CREATE TABLE payment(
    transaction_id SERIAL,
    currency VARCHAR(50),
    pay_method_fk SERIAL,
    value FLOAT NOT NULL,
    FOREIGN kEY (pay_method_fk) REFERENCES PayMethod(pay_method_id),
    PRIMARY KEY (transaction_id)
);
