USE heroku_b7b80bd4f1b1e81;

CREATE TABLE IF NOT EXISTS departments
(
    d_id    INT AUTO_INCREMENT PRIMARY KEY,
    d_name  VARCHAR(255) NOT NULL,
    salary  DECIMAL      NOT NULL,
    airport BOOL         NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS employees
(
    e_id   INT AUTO_INCREMENT PRIMARY KEY,
    doj    DATETIME,
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
    FOREIGN KEY (e_id) REFERENCES employees (e_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (a_id) REFERENCES airlines (a_id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS flights
(
    f_id        INT AUTO_INCREMENT PRIMARY KEY,
    a_id        INT,
    origin      VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    f_status    VARCHAR(10)  NOT NULL,
    f_time      DATETIME     NOT NULL,
    FOREIGN KEY (a_id) REFERENCES airlines (a_id)
);

CREATE TABLE IF NOT EXISTS crew
(
    f_id INT,
    e_id INT,
    FOREIGN KEY (f_id) REFERENCES flights (f_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (e_id) REFERENCES airlineEmployees (e_id) ON UPDATE CASCADE ON DELETE CASCADE
#     CONSTRAINT same_airline CHECK ( (SELECT a_id from airlineEmployees where crew.e_id = airlineEmployees.e_id ) = (select a_id from flights where crew.f_id = flights.f_id) ) ENFORCED
);