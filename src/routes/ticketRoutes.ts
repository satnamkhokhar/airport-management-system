import { Router } from 'express';
import { getTickets, getTicketById, getTicketsByPassenger, createTicket, updateTicket, deleteTicket } from '../controllers/ticketController';

const router = Router();
router.get('/passenger/:passengerId', getTicketsByPassenger);
router.get('/',       getTickets);
router.get('/:id',    getTicketById);
router.post('/',      createTicket);
router.put('/:id',    updateTicket);
router.delete('/:id', deleteTicket);
export default router;