import { Request, Response } from 'express';
import pool from '../db/pool';

export const getAircraft = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Aircraft');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch aircraft', details: err });
  }
};

export const getAircraftById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM Aircraft WHERE AircraftID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Aircraft not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch aircraft', details: err });
  }
};

export const createAircraft = async (req: Request, res: Response) => {
  const { TailNumber, Model, Capacity } = req.body;
  if (!TailNumber || !Model || !Capacity) {
    return res.status(400).json({ error: 'TailNumber, Model, and Capacity are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Aircraft (TailNumber, Model, Capacity) VALUES (?, ?, ?)',
      [TailNumber, Model, Capacity]
    );
    res.status(201).json({ message: 'Aircraft created', AircraftID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create aircraft', details: err });
  }
};

export const updateAircraft = async (req: Request, res: Response) => {
  const { TailNumber, Model, Capacity } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Aircraft SET TailNumber = ?, Model = ?, Capacity = ? WHERE AircraftID = ?',
      [TailNumber, Model, Capacity, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Aircraft not found' });
    res.json({ message: 'Aircraft updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update aircraft', details: err });
  }
};

export const deleteAircraft = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Aircraft WHERE AircraftID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Aircraft not found' });
    res.json({ message: 'Aircraft deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete aircraft', details: err });
  }
};