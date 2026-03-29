import { Router } from 'express';
import {
  getBaggage, getBaggageById, getBaggageByFlight,
  getUndeliveredBaggageByFlight, createBaggage,
  updateBaggage, updateBaggageStatus, deleteBaggage
} from '../controllers/baggageController';

const router = Router();
router.get('/flight/:flightId',             getBaggageByFlight);
router.get('/flight/:flightId/undelivered', getUndeliveredBaggageByFlight);
router.get('/',       getBaggage);
router.get('/:id',    getBaggageById);
router.post('/',      createBaggage);
router.put('/:id',    updateBaggage);
router.patch('/:id/status', updateBaggageStatus);
router.delete('/:id', deleteBaggage);
export default router;