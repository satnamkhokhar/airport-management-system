-- ─────────────────────────────────────────────
-- Seed Data for Airport Management System
-- ─────────────────────────────────────────────

USE airport_db;

-- Airports
INSERT INTO Airport (Name, Location, IATACode) VALUES
('Hartsfield-Jackson Atlanta International', 'Atlanta, GA', 'ATL'),
('John F. Kennedy International', 'New York, NY', 'JFK'),
('Los Angeles International', 'Los Angeles, CA', 'LAX'),
('OHare International', 'Chicago, IL', 'ORD'),
('Dallas Fort Worth International', 'Dallas, TX', 'DFW');

-- Gates
INSERT INTO Gate (GateNumber, AirportID) VALUES
('A1', 1), ('A2', 1), ('A3', 1), ('B1', 1), ('B2', 1),
('A1', 2), ('A2', 2), ('B1', 2), ('B2', 2),
('A1', 3), ('A2', 3), ('B1', 3),
('A1', 4), ('A2', 4), ('B1', 4),
('A1', 5), ('A2', 5);

-- Aircraft
INSERT INTO Aircraft (TailNumber, Model, Capacity) VALUES
('N101DL', 'Boeing 737-800', 160),
('N202AA', 'Airbus A320', 150),
('N303UA', 'Boeing 757-200', 200),
('N404SW', 'Boeing 737 MAX', 175),
('N505DL', 'Airbus A321', 185),
('N606AA', 'Boeing 777-200', 300),
('N707UA', 'Airbus A319', 128),
('N808SW', 'Boeing 737-700', 143);

-- Flights
INSERT INTO Flight (FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, GateID) VALUES
('DL101', 'DL', 'On Time',  '2025-06-01 06:00:00', '2025-06-01 06:00:00', 1, 1, 2, 1),
('DL202', 'DL', 'Delayed',  '2025-06-01 08:30:00', '2025-06-01 09:15:00', 5, 1, 3, 2),
('AA301', 'AA', 'On Time',  '2025-06-01 07:00:00', '2025-06-01 07:00:00', 2, 2, 1, 6),
('AA402', 'AA', 'Cancelled','2025-06-01 09:00:00', NULL,                  6, 2, 4, 7),
('UA501', 'UA', 'On Time',  '2025-06-01 10:00:00', '2025-06-01 10:05:00', 3, 3, 5, 10),
('UA602', 'UA', 'Delayed',  '2025-06-01 11:30:00', '2025-06-01 12:45:00', 7, 4, 2, 13),
('SW701', 'SW', 'On Time',  '2025-06-01 13:00:00', '2025-06-01 13:00:00', 4, 5, 1, 16),
('SW802', 'SW', 'On Time',  '2025-06-01 14:30:00', '2025-06-01 14:30:00', 8, 1, 4, 3),
('DL303', 'DL', 'On Time',  '2025-06-01 15:00:00', '2025-06-01 15:00:00', 1, 3, 2, 11),
('AA505', 'AA', 'Delayed',  '2025-06-01 16:00:00', '2025-06-01 17:20:00', 2, 4, 3, 14);

-- Passengers
INSERT INTO Passenger (FirstName, LastName) VALUES
('James', 'Smith'),
('Emily', 'Johnson'),
('Michael', 'Williams'),
('Sarah', 'Brown'),
('David', 'Jones'),
('Jessica', 'Garcia'),
('Daniel', 'Miller'),
('Ashley', 'Davis'),
('Matthew', 'Martinez'),
('Amanda', 'Wilson'),
('Chris', 'Taylor'),
('Stephanie', 'Anderson'),
('Kevin', 'Thomas'),
('Rachel', 'Jackson'),
('Brian', 'White'),
('Megan', 'Harris'),
('Justin', 'Thompson'),
('Nicole', 'Moore'),
('Andrew', 'Martin'),
('Brittany', 'Lee');

-- Tickets
INSERT INTO Ticket (SeatNumber, PassengerID, FlightID) VALUES
('1A', 1,  1), ('2B', 2,  1), ('3C', 3,  1), ('4A', 4,  1),
('1B', 5,  2), ('2A', 6,  2), ('3B', 7,  2),
('1A', 8,  3), ('2C', 9,  3), ('3A', 10, 3),
('1C', 11, 5), ('2B', 12, 5), ('3A', 13, 5),
('1A', 14, 6), ('2A', 15, 6),
('1B', 16, 7), ('2C', 17, 7), ('3B', 18, 7),
('1A', 19, 9), ('2B', 20, 9);

-- Baggage
INSERT INTO Baggage (Weight, Status, TicketID) VALUES
(23.5, 'Delivered',   1),
(18.0, 'Delivered',   2),
(30.2, 'Delivered',   3),
(15.5, 'Delivered',   4),
(22.0, 'Offloaded',   5),
(28.5, 'Offloaded',   6),
(19.0, 'Loaded',      7),
(25.0, 'Delivered',   8),
(21.5, 'Delivered',   9),
(17.0, 'Delivered',   10),
(26.0, 'Loaded',      11),
(20.0, 'Checked-in',  12),
(33.0, 'Loaded',      13),
(24.5, 'Checked-in',  14),
(16.5, 'Checked-in',  15),
(29.0, 'Delivered',   16),
(22.5, 'Delivered',   17),
(18.5, 'Delivered',   18),
(27.0, 'Loaded',      19),
(23.0, 'Checked-in',  20);