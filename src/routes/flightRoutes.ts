import { Router } from 'express';
import {
  getFlights, getFlightById, createFlight, updateFlight,
  updateFlightStatus, deleteFlight, getFlightsByAirportAndDate,
  searchFlights, getFlightsByGate, getPassengerManifest
} from '../controllers/flightController';

const router = Router();
router.get('/search',              searchFlights);
router.get('/airport/:airportId',  getFlightsByAirportAndDate);
router.get('/gate/:gateId',        getFlightsByGate);
router.get('/',                    getFlights);
router.get('/:id',                 getFlightById);
router.get('/:id/passengers',      getPassengerManifest);
router.post('/',                   createFlight);
router.put('/:id',                 updateFlight);
router.patch('/:id/status',        updateFlightStatus);
router.delete('/:id',              deleteFlight);
export default router;