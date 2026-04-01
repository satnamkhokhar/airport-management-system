# Airport Operations & Passenger Management System

Full-stack airport management system with:
- Node.js + Express + TypeScript backend
- Vite frontend admin dashboard
- MySQL database running in Docker

The frontend connects to the backend API and provides operational views for flights, gates, passengers, tickets, baggage, and airport traffic analytics.

---

## Setup

### 1. Install dependencies
```bash
npm install
cd frontend && npm install
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

### 5. Start the frontend
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

The frontend uses the Vite proxy in `frontend/vite.config.js` to forward `/api` and `/health` requests to the backend on port `3000`.

---

## Project Structure
```
airport-management-system/
├── docker-compose.yml
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── main.js
│       ├── app.js
│       ├── api.js
│       ├── constants.js
│       ├── render.js
│       ├── template.js
│       ├── utils.js
│       └── style.css
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
