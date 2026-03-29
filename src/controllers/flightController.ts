import { Request, Response } from 'express';
import pool from '../db/pool';

export const getFlights = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*,
        dep.Name AS DepartureAirportName, dep.IATACode AS DepartureIATA,
        arr.Name AS ArrivalAirportName,   arr.IATACode AS ArrivalIATA,
        ac.Model AS AircraftModel,        ac.TailNumber,
        g.GateNumber
      FROM Flight f
      JOIN Airport dep  ON f.DepartureAirportID = dep.AirportID
      JOIN Airport arr  ON f.ArrivalAirportID   = arr.AirportID
      JOIN Aircraft ac  ON f.AircraftID         = ac.AircraftID
      JOIN Gate g       ON f.GateID             = g.GateID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights', details: err });
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT f.*,
        dep.Name AS DepartureAirportName, dep.IATACode AS DepartureIATA,
        arr.Name AS ArrivalAirportName,   arr.IATACode AS ArrivalIATA,
        ac.Model AS AircraftModel,        ac.TailNumber,
        g.GateNumber
      FROM Flight f
      JOIN Airport dep  ON f.DepartureAirportID = dep.AirportID
      JOIN Airport arr  ON f.ArrivalAirportID   = arr.AirportID
      JOIN Aircraft ac  ON f.AircraftID         = ac.AircraftID
      JOIN Gate g       ON f.GateID             = g.GateID
      WHERE f.FlightID = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Flight not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flight', details: err });
  }
};

export const createFlight = async (req: Request, res: Response) => {
  const { FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, GateID } = req.body;
  if (!FlightNumber || !Airline || !DepartureTime || !AircraftID || !DepartureAirportID || !ArrivalAirportID || !GateID) {
    return res.status(400).json({ error: 'FlightNumber, Airline, DepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, and GateID are required' });
  }
  try {
    const [result]: any = await pool.query(
      `INSERT INTO Flight (FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, GateID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [FlightNumber, Airline, Status || 'On Time', DepartureTime, ActualDepartureTime || null, AircraftID, DepartureAirportID, ArrivalAirportID, GateID]
    );
    res.status(201).json({ message: 'Flight created', FlightID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create flight', details: err });
  }
};

export const updateFlight = async (req: Request, res: Response) => {
  const { FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime, AircraftID, DepartureAirportID, ArrivalAirportID, GateID } = req.body;
  try {
    const [result]: any = await pool.query(
      `UPDATE Flight SET FlightNumber=?, Airline=?, Status=?, DepartureTime=?, ActualDepartureTime=?,
       AircraftID=?, DepartureAirportID=?, ArrivalAirportID=?, GateID=? WHERE FlightID=?`,
      [FlightNumber, Airline, Status, DepartureTime, ActualDepartureTime || null, AircraftID, DepartureAirportID, ArrivalAirportID, GateID, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Flight updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update flight', details: err });
  }
};

export const updateFlightStatus = async (req: Request, res: Response) => {
  const { Status, ActualDepartureTime } = req.body;
  if (!Status) return res.status(400).json({ error: 'Status is required' });
  try {
    const [result]: any = await pool.query(
      'UPDATE Flight SET Status=?, ActualDepartureTime=? WHERE FlightID=?',
      [Status, ActualDepartureTime || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Flight status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update flight status', details: err });
  }
};

export const deleteFlight = async (req: Request, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM Flight WHERE FlightID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flight', details: err });
  }
};

export const getFlightsByAirportAndDate = async (req: Request, res: Response) => {
  const { date } = req.query;
  const { airportId } = req.params;
  if (!date) return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
  try {
    const [rows] = await pool.query(`
      SELECT f.*, dep.IATACode AS DepartureIATA, arr.IATACode AS ArrivalIATA, g.GateNumber
      FROM Flight f
      JOIN Airport dep ON f.DepartureAirportID = dep.AirportID
      JOIN Airport arr ON f.ArrivalAirportID   = arr.AirportID
      JOIN Gate g      ON f.GateID             = g.GateID
      WHERE (f.DepartureAirportID = ? OR f.ArrivalAirportID = ?)
        AND DATE(f.DepartureTime) = ?
      ORDER BY f.DepartureTime ASC
    `, [airportId, airportId, date]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights', details: err });
  }
};

export const searchFlights = async (req: Request, res: Response) => {
  const { airline, status, date } = req.query;
  const conditions: string[] = [];
  const params: any[] = [];

  if (airline) { conditions.push('f.Airline = ?');             params.push(airline); }
  if (status)  { conditions.push('f.Status = ?');              params.push(status); }
  if (date)    { conditions.push('DATE(f.DepartureTime) = ?'); params.push(date); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  try {
    const [rows] = await pool.query(`
      SELECT f.*, dep.IATACode AS DepartureIATA, arr.IATACode AS ArrivalIATA, g.GateNumber
      FROM Flight f
      JOIN Airport dep ON f.DepartureAirportID = dep.AirportID
      JOIN Airport arr ON f.ArrivalAirportID   = arr.AirportID
      JOIN Gate g      ON f.GateID             = g.GateID
      ${where}
      ORDER BY f.DepartureTime ASC
    `, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search flights', details: err });
  }
};

export const getFlightsByGate = async (req: Request, res: Response) => {
  const { gateId } = req.params;
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end query params are required' });
  try {
    const [rows] = await pool.query(`
      SELECT f.FlightID, f.FlightNumber, f.Airline, f.Status, f.DepartureTime, f.ActualDepartureTime
      FROM Flight f
      WHERE f.GateID = ? AND f.DepartureTime BETWEEN ? AND ?
      ORDER BY f.DepartureTime ASC
    `, [gateId, start, end]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights for gate', details: err });
  }
};

export const getPassengerManifest = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.PassengerID, p.FirstName, p.LastName, t.TicketID, t.SeatNumber
      FROM Ticket t
      JOIN Passenger p ON t.PassengerID = p.PassengerID
      WHERE t.FlightID = ?
      ORDER BY t.SeatNumber ASC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passenger manifest', details: err });
  }
};