import { Router } from 'express';
import { getGates, getGateById, getGatesByAirport, createGate, updateGate, deleteGate } from '../controllers/gateController';

const router = Router();
router.get('/airport/:airportId', getGatesByAirport);
router.get('/',       getGates);
router.get('/:id',    getGateById);
router.post('/',      createGate);
router.put('/:id',    updateGate);
router.delete('/:id', deleteGate);
export default router;