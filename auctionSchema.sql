DROP DATABASE IF EXISTS greatBay_DB;

CREATE DATABASE greatBay_DB;

USE greatBay_DB;

CREATE TABLE auctions (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(100) NOT NULL,
  category VARCHAR(40) NOT NULL,
  bid DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE bids (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(40) NOT NULL,
  bid DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM auctions;