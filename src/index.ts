import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import airportRoutes   from './routes/airportRoutes';
import gateRoutes      from './routes/gateRoutes';
import aircraftRoutes  from './routes/aircraftRoutes';
import flightRoutes    from './routes/flightRoutes';
import passengerRoutes from './routes/passengerRoutes';
import ticketRoutes    from './routes/ticketRoutes';
import baggageRoutes   from './routes/baggageRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/airports',   airportRoutes);
app.use('/api/gates',      gateRoutes);
app.use('/api/aircraft',   aircraftRoutes);
app.use('/api/flights',    flightRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/tickets',    ticketRoutes);
app.use('/api/baggage',    baggageRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;