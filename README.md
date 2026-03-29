# Airport Operations & Passenger Management System

Node.js + Express + TypeScript backend for the Airport Operations system.
MySQL runs in Docker. All API endpoints documented below.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env` file in the root of the project:
```
DB_HOST=localhost
DB_PORT=3307
DB_USER=airport_user
DB_PASSWORD=airport_pass
DB_NAME=airport_db
PORT=3000
```

### 3. Start the MySQL database (Docker)
```bash
docker-compose up -d
```
This starts MySQL on port `3307` and automatically runs `src/db/schema.sql` to create all tables.

### 4. Start the backend server
```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

Server runs at: `http://localhost:3000`

---

## Project Structure
```
airport-backend/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── index.ts
    ├── db/
    │   ├── pool.ts
    │   └── schema.sql
    ├── controllers/
    │   ├── airportController.ts
    │   ├── gateController.ts
    │   ├── aircraftController.ts
    │   ├── flightController.ts
    │   ├── passengerController.ts
    │   ├── ticketController.ts
    │   └── baggageController.ts
    └── routes/
        ├── airportRoutes.ts
        ├── gateRoutes.ts
        ├── aircraftRoutes.ts
        ├── flightRoutes.ts
        ├── passengerRoutes.ts
        ├── ticketRoutes.ts
        └── baggageRoutes.ts
```

---

## Database Schema

| Table     | Key Columns                                                                                                                           |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------|
| Airport   | AirportID, Name, Location, IATACode                                                                                                   |
| Gate      | GateID, GateNumber, AirportID → Airport                                                                                               |
| Aircraft  | AircraftID, TailNumber, Model, Capacity                                                                                               |
| Flight    | FlightID, FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, GateID |
| Passenger | PassengerID, FirstName, LastName                                                                                                      |
| Ticket    | TicketID, SeatNumber, PassengerID → Passenger, FlightID → Flight                                                                     |
| Baggage   | BaggageID, Weight, Status, TicketID → Ticket                                                                                         |

**Flight Status values:** `On Time` | `Delayed` | `Cancelled`

**Baggage Status values:** `Checked-in` | `Loaded` | `Offloaded` | `Delivered`

---

## API Reference

### Health Check
| Method | Endpoint | Description         |
|--------|----------|---------------------|
| GET    | /health  | Server health check |

---

### Airports `/api/airports`

| Method | Endpoint | Description       |
|--------|----------|-------------------|
| GET    | /        | Get all airports  |
| GET    | /:id     | Get airport by ID |
| POST   | /        | Create airport    |
| PUT    | /:id     | Update airport    |
| DELETE | /:id     | Delete airport    |

**POST / PUT body:**
```json
{
  "Name": "Hartsfield-Jackson Atlanta",
  "Location": "Atlanta, GA",
  "IATACode": "ATL"
}
```

---

### Gates `/api/gates`

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| GET    | /                     | Get all gates               |
| GET    | /:id                  | Get gate by ID              |
| GET    | /airport/:airportId   | Get all gates at an airport |
| POST   | /                     | Create gate                 |
| PUT    | /:id                  | Update gate                 |
| DELETE | /:id                  | Delete gate                 |

**POST / PUT body:**
```json
{
  "GateNumber": "A12",
  "AirportID": 1
}
```

---

### Aircraft `/api/aircraft`

| Method | Endpoint | Description         |
|--------|----------|---------------------|
| GET    | /        | Get all aircraft    |
| GET    | /:id     | Get aircraft by ID  |
| POST   | /        | Create aircraft     |
| PUT    | /:id     | Update aircraft     |
| DELETE | /:id     | Delete aircraft     |

**POST / PUT body:**
```json
{
  "TailNumber": "N12345",
  "Model": "Boeing 737",
  "Capacity": 180
}
```

---

### Flights `/api/flights`

| Method | Endpoint                             | Description                                          |
|--------|--------------------------------------|------------------------------------------------------|
| GET    | /                                    | Get all flights (with joined airport/aircraft info)  |
| GET    | /:id                                 | Get flight by ID                                     |
| GET    | /:id/passengers                      | Get passenger manifest for a flight                  |
| GET    | /search?airline=&status=&date=       | Search flights by airline, status, and/or date       |
| GET    | /airport/:airportId?date=YYYY-MM-DD  | Get all flights at an airport on a given date        |
| GET    | /gate/:gateId?start=&end=            | Get flights at a gate within a time window           |
| POST   | /                                    | Create flight                                        |
| PUT    | /:id                                 | Update flight                                        |
| PATCH  | /:id/status                          | Update flight status only                            |
| DELETE | /:id                                 | Delete flight                                        |

**POST / PUT body:**
```json
{
  "FlightNumber": "DL404",
  "Airline": "DL",
  "Status": "On Time",
  "DepartureTime": "2025-04-01T08:00:00",
  "ActualDepartureTime": null,
  "AircraftID": 1,
  "DepartureAirportID": 1,
  "ArrivalAirportID": 2,
  "GateID": 3
}
```

**PATCH status body:**
```json
{
  "Status": "Delayed",
  "ActualDepartureTime": "2025-04-01T09:15:00"
}
```

**Search examples:**
```
GET /api/flights/search?airline=DL
GET /api/flights/search?status=Delayed
GET /api/flights/search?date=2025-04-01
GET /api/flights/search?airline=DL&status=Delayed&date=2025-04-01
```

**Gate conflict check example:**
```
GET /api/flights/gate/3?start=2025-04-01T06:00:00&end=2025-04-01T12:00:00
```

---

### Passengers `/api/passengers`

| Method | Endpoint | Description          |
|--------|----------|----------------------|
| GET    | /        | Get all passengers   |
| GET    | /:id     | Get passenger by ID  |
| POST   | /        | Create passenger     |
| PUT    | /:id     | Update passenger     |
| DELETE | /:id     | Delete passenger     |

**POST / PUT body:**
```json
{
  "FirstName": "John",
  "LastName": "Doe"
}
```

---

### Tickets `/api/tickets`

| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| GET    | /                           | Get all tickets                  |
| GET    | /:id                        | Get ticket by ID                 |
| GET    | /passenger/:passengerId     | Get all tickets for a passenger  |
| POST   | /                           | Create ticket                    |
| PUT    | /:id                        | Update ticket                    |
| DELETE | /:id                        | Delete ticket                    |

**POST / PUT body:**
```json
{
  "SeatNumber": "14A",
  "PassengerID": 1,
  "FlightID": 1
}
```

---

### Baggage `/api/baggage`

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | /                                 | Get all baggage                      |
| GET    | /:id                              | Get baggage by ID                    |
| GET    | /flight/:flightId                 | Get all baggage for a flight         |
| GET    | /flight/:flightId/undelivered     | Get undelivered baggage for a flight |
| POST   | /                                 | Create baggage record                |
| PUT    | /:id                              | Update baggage                       |
| PATCH  | /:id/status                       | Update baggage status only           |
| DELETE | /:id                              | Delete baggage                       |

**POST / PUT body:**
```json
{
  "Weight": 23.5,
  "Status": "Checked-in",
  "TicketID": 1
}
```

**PATCH status body:**
```json
{
  "Status": "Loaded"
}
```

---

## Daily Workflow
```bash
# Start everything
docker-compose up -d
npm run dev

# Stop everything
# Ctrl+C to stop the server
docker-compose down
```

## Resetting the Database

If you need to wipe all data and start fresh:
```bash
docker-compose down -v
docker-compose up -d
```
