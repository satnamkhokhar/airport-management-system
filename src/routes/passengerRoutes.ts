import { Router } from 'express';
import { getPassengers, getPassengerById, createPassenger, updatePassenger, deletePassenger } from '../controllers/passengerController';

const router = Router();
router.get('/',       getPassengers);
router.get('/:id',    getPassengerById);
router.post('/',      createPassenger);
router.put('/:id',    updatePassenger);
router.delete('/:id', deletePassenger);
export default router;