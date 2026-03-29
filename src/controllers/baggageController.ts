import { Request, Response } from 'express';
import pool from '../db/pool';

export const getBaggage = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, t.SeatNumber, t.FlightID, p.FirstName, p.LastName
      FROM Baggage b
      JOIN Ticket    t ON b.TicketID    = t.TicketID
      JOIN Passenger p ON t.PassengerID = p.PassengerID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch baggage', details: err });
  }
};

export const getBaggageById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT b.*, t.SeatNumber, t.FlightID, p.FirstName, p.LastName
      FROM Baggage b
      JOIN Ticket    t ON b.TicketID    = t.TicketID
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      WHERE b.BaggageID = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Baggage not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch baggage', details: err });
  }
};

export const getBaggageByFlight = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, p.FirstName, p.LastName, t.SeatNumber
      FROM Baggage b
      JOIN Ticket    t ON b.TicketID    = t.TicketID
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      WHERE t.FlightID = ?
      ORDER BY b.Status ASC
    `, [req.params.flightId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch baggage for flight', details: err });
  }
};

export const getUndeliveredBaggageByFlight = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, p.FirstName, p.LastName, t.SeatNumber
      FROM Baggage b
      JOIN Ticket    t ON b.TicketID    = t.TicketID
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      WHERE t.FlightID = ? AND b.Status != 'Delivered'
      ORDER BY b.Status ASC
    `, [req.params.flightId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch undelivered baggage', details: err });
  }
};

export const createBaggage = async (req: Request, res: Response) => {
  const { Weight, Status, TicketID } = req.body;
  if (!Weight || !TicketID) {
    return res.status(400).json({ error: 'Weight and TicketID are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Baggage (Weight, Status, TicketID) VALUES (?, ?, ?)',
      [Weight, Status || 'Checked-in', TicketID]
    );
    res.status(201).json({ message: 'Baggage created', BaggageID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create baggage', details: err });
  }
};

export const updateBaggage = async (req: Request, res: Response) => {
  const { Weight, Status, TicketID } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Baggage SET Weight = ?, Status = ?, TicketID = ? WHERE BaggageID = ?',
      [Weight, Status, TicketID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Baggage not found' });
    res.json({ message: 'Baggage updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update baggage', details: err });
  }
};

export const updateBaggageStatus = async (req: Request, res: Response) => {
  const { Status } = req.body;
  if (!Status) return res.status(400).json({ error: 'Status is required' });
  try {
    const [result]: any = await pool.query(
      'UPDATE Baggage SET Status = ? WHERE BaggageID = ?',
      [Status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Baggage not found' });
    res.json({ message: 'Baggage status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update baggage status', details: err });
  }
};

export const deleteBaggage = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Baggage WHERE BaggageID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Baggage not found' });
    res.json({ message: 'Baggage deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete baggage', details: err });
  }
};