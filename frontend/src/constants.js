export const API_BASE = import.meta.env.VITE_API_BASE || '/api'
export const HEALTH_URL = import.meta.env.VITE_HEALTH_URL || '/health'

export const flightStatuses = ['On Time', 'Delayed', 'Cancelled']
export const baggageStatuses = ['Checked-in', 'Loaded', 'Offloaded', 'Delivered']

export const initialState = {
  airports: [],
  gates: [],
  aircraft: [],
  flights: [],
  passengers: [],
  tickets: [],
  baggage: [],
  health: null,
  searchResults: [],
  airportSchedule: [],
  gateWindow: [],
  manifest: [],
  baggageByFlight: [],
  undeliveredBaggage: [],
}
