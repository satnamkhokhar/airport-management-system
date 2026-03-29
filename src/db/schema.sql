CREATE DATABASE IF NOT EXISTS airport_db;
USE airport_db;

CREATE TABLE IF NOT EXISTS Airport (
  AirportID   INT AUTO_INCREMENT PRIMARY KEY,
  Name        VARCHAR(100) NOT NULL,
  Location    VARCHAR(100) NOT NULL,
  IATACode    CHAR(3) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Gate (
  GateID      INT AUTO_INCREMENT PRIMARY KEY,
  GateNumber  VARCHAR(10) NOT NULL,
  AirportID   INT NOT NULL,
  FOREIGN KEY (AirportID) REFERENCES Airport(AirportID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Aircraft (
  AircraftID  INT AUTO_INCREMENT PRIMARY KEY,
  TailNumber  VARCHAR(20) UNIQUE NOT NULL,
  Model       VARCHAR(50) NOT NULL,
  Capacity    INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Flight (
  FlightID              INT AUTO_INCREMENT PRIMARY KEY,
  FlightNumber          VARCHAR(10) NOT NULL,
  Airline               VARCHAR(5)  NOT NULL,
  Status                ENUM('On Time', 'Delayed', 'Cancelled') NOT NULL DEFAULT 'On Time',
  DepartureTime         DATETIME NOT NULL,
  ActualDepartureTime   DATETIME DEFAULT NULL,
  AircraftID            INT NOT NULL,
  DepartureAirportID    INT NOT NULL,
  ArrivalAirportID      INT NOT NULL,
  GateID                INT NOT NULL,
  FOREIGN KEY (AircraftID)         REFERENCES Aircraft(AircraftID) ON DELETE RESTRICT,
  FOREIGN KEY (DepartureAirportID) REFERENCES Airport(AirportID)  ON DELETE RESTRICT,
  FOREIGN KEY (ArrivalAirportID)   REFERENCES Airport(AirportID)  ON DELETE RESTRICT,
  FOREIGN KEY (GateID)             REFERENCES Gate(GateID)        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Passenger (
  PassengerID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName   VARCHAR(50) NOT NULL,
  LastName    VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Ticket (
  TicketID    INT AUTO_INCREMENT PRIMARY KEY,
  SeatNumber  VARCHAR(5) NOT NULL,
  PassengerID INT NOT NULL,
  FlightID    INT NOT NULL,
  FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID) ON DELETE CASCADE,
  FOREIGN KEY (FlightID)    REFERENCES Flight(FlightID)       ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Baggage (
  BaggageID  INT AUTO_INCREMENT PRIMARY KEY,
  Weight     DECIMAL(5,2) NOT NULL,
  Status     ENUM('Checked-in', 'Loaded', 'Offloaded', 'Delivered') NOT NULL DEFAULT 'Checked-in',
  TicketID   INT NOT NULL,
  FOREIGN KEY (TicketID) REFERENCES Ticket(TicketID) ON DELETE CASCADE
);