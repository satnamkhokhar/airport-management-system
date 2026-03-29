import { Request, Response } from 'express';
import pool from '../db/pool';

export const getPassengers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Passenger');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passengers', details: err });
  }
};

export const getPassengerById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM Passenger WHERE PassengerID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Passenger not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passenger', details: err });
  }
};

export const createPassenger = async (req: Request, res: Response) => {
  const { FirstName, LastName } = req.body;
  if (!FirstName || !LastName) {
    return res.status(400).json({ error: 'FirstName and LastName are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Passenger (FirstName, LastName) VALUES (?, ?)',
      [FirstName, LastName]
    );
    res.status(201).json({ message: 'Passenger created', PassengerID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create passenger', details: err });
  }
};

export const updatePassenger = async (req: Request, res: Response) => {
  const { FirstName, LastName } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Passenger SET FirstName = ?, LastName = ? WHERE PassengerID = ?',
      [FirstName, LastName, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Passenger not found' });
    res.json({ message: 'Passenger updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update passenger', details: err });
  }
};

export const deletePassenger = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Passenger WHERE PassengerID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Passenger not found' });
    res.json({ message: 'Passenger deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete passenger', details: err });
  }
};