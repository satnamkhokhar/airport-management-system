import { Request, Response } from 'express';
import pool from '../db/pool';

export const getTickets = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, p.FirstName, p.LastName, f.FlightNumber, f.Airline
      FROM Ticket t
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      JOIN Flight f    ON t.FlightID    = f.FlightID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: err });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT t.*, p.FirstName, p.LastName, f.FlightNumber, f.Airline
      FROM Ticket t
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      JOIN Flight f    ON t.FlightID    = f.FlightID
      WHERE t.TicketID = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket', details: err });
  }
};

export const getTicketsByPassenger = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, f.FlightNumber, f.Airline, f.DepartureTime, f.Status
      FROM Ticket t
      JOIN Flight f ON t.FlightID = f.FlightID
      WHERE t.PassengerID = ?
    `, [req.params.passengerId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets for passenger', details: err });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  const { SeatNumber, PassengerID, FlightID } = req.body;
  if (!SeatNumber || !PassengerID || !FlightID) {
    return res.status(400).json({ error: 'SeatNumber, PassengerID, and FlightID are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Ticket (SeatNumber, PassengerID, FlightID) VALUES (?, ?, ?)',
      [SeatNumber, PassengerID, FlightID]
    );
    res.status(201).json({ message: 'Ticket created', TicketID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket', details: err });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const { SeatNumber, PassengerID, FlightID } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Ticket SET SeatNumber = ?, PassengerID = ?, FlightID = ? WHERE TicketID = ?',
      [SeatNumber, PassengerID, FlightID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket', details: err });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Ticket WHERE TicketID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket', details: err });
  }
};