import { Router } from 'express';
import { getAirports, getAirportById, createAirport, updateAirport, deleteAirport } from '../controllers/airportController';

const router = Router();
router.get('/',       getAirports);
router.get('/:id',    getAirportById);
router.post('/',      createAirport);
router.put('/:id',    updateAirport);
router.delete('/:id', deleteAirport);
export default router;