import { Request, Response } from 'express';
import pool from '../db/pool';

export const getAirports = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Airport');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch airports', details: err });
  }
};

export const getAirportById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM Airport WHERE AirportID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Airport not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch airport', details: err });
  }
};

export const createAirport = async (req: Request, res: Response) => {
  const { Name, Location, IATACode } = req.body;
  if (!Name || !Location || !IATACode) {
    return res.status(400).json({ error: 'Name, Location, and IATACode are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Airport (Name, Location, IATACode) VALUES (?, ?, ?)',
      [Name, Location, IATACode]
    );
    res.status(201).json({ message: 'Airport created', AirportID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create airport', details: err });
  }
};

export const updateAirport = async (req: Request, res: Response) => {
  const { Name, Location, IATACode } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Airport SET Name = ?, Location = ?, IATACode = ? WHERE AirportID = ?',
      [Name, Location, IATACode, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Airport not found' });
    res.json({ message: 'Airport updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update airport', details: err });
  }
};

export const deleteAirport = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Airport WHERE AirportID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Airport not found' });
    res.json({ message: 'Airport deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete airport', details: err });
  }
};