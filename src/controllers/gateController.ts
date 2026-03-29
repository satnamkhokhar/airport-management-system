import { Request, Response } from 'express';
import pool from '../db/pool';

export const getGates = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, a.Name AS AirportName, a.IATACode
       FROM Gate g JOIN Airport a ON g.AirportID = a.AirportID`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gates', details: err });
  }
};

export const getGateById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT g.*, a.Name AS AirportName, a.IATACode
       FROM Gate g JOIN Airport a ON g.AirportID = a.AirportID
       WHERE g.GateID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Gate not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gate', details: err });
  }
};

export const getGatesByAirport = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Gate WHERE AirportID = ?', [req.params.airportId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gates for airport', details: err });
  }
};

export const createGate = async (req: Request, res: Response) => {
  const { GateNumber, AirportID } = req.body;
  if (!GateNumber || !AirportID) {
    return res.status(400).json({ error: 'GateNumber and AirportID are required' });
  }
  try {
    const [result]: any = await pool.query(
      'INSERT INTO Gate (GateNumber, AirportID) VALUES (?, ?)',
      [GateNumber, AirportID]
    );
    res.status(201).json({ message: 'Gate created', GateID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gate', details: err });
  }
};

export const updateGate = async (req: Request, res: Response) => {
  const { GateNumber, AirportID } = req.body;
  try {
    const [result]: any = await pool.query(
      'UPDATE Gate SET GateNumber = ?, AirportID = ? WHERE GateID = ?',
      [GateNumber, AirportID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Gate not found' });
    res.json({ message: 'Gate updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gate', details: err });
  }
};

export const deleteGate = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Gate WHERE GateID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Gate not found' });
    res.json({ message: 'Gate deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gate', details: err });
  }
};