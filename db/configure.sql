CREATE DATABASE IF NOT EXISTS dbs;
USE dbs;

CREATE TABLE IF NOT EXISTS departments
(
    d_id   INT AUTO_INCREMENT PRIMARY KEY,
    d_name VARCHAR(255) NOT NULL,
    salary DECIMAL      NOT NULL
);

CREATE TABLE IF NOT EXISTS employees
(
    e_id   INT AUTO_INCREMENT PRIMARY KEY,
    doj    DATETIME DEFAULT NOW(),
    e_name VARCHAR(255) NOT NULL,
    d_id   INT,
    FOREIGN KEY (d_id) REFERENCES departments (d_id)
);

CREATE TABLE IF NOT EXISTS airlines
(
    a_id   INT AUTO_INCREMENT PRIMARY KEY,
    a_name VARCHAR(255) NOT NULL,
    doj    DATE
);

CREATE TABLE IF NOT EXISTS airlineEmployees
(
    e_id INT,
    a_id INT,
    FOREIGN KEY (e_id) REFERENCES employees (e_id),
    FOREIGN KEY (a_id) REFERENCES airlines (a_id)
);

CREATE TABLE IF NOT EXISTS flights
(
    f_id        INT AUTO_INCREMENT PRIMARY KEY,
    a_id        INT,
    origin      VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    f_status    VARCHAR(10)  NOT NULL,
    f_time      DATETIME     NOT NULL DEFAULT NOW(),
    FOREIGN KEY (a_id) REFERENCES airlines (a_id)
);

CREATE TABLE IF NOT EXISTS crew
(
    f_id INT,
    e_id INT,
    FOREIGN KEY (f_id) REFERENCES flights (f_id),
    FOREIGN KEY (e_id) REFERENCES airlineEmployees (e_id)
);