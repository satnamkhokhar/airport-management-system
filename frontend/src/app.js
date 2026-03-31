import { fetchJson, fetchDashboardData } from './api'
import { API_BASE, initialState } from './constants'
import { renderAnalytics, renderResults, renderSelects, renderSummary, renderTables, setStatus } from './render'
import { getAppMarkup } from './template'
import { formatDateTime, serializeForm, toBackendDateTime } from './utils'

const state = { ...initialState }

function refreshView() {
  renderAnalytics(state)
  renderSummary(state)
  renderSelects(state)
  renderTables(state)
  renderResults(state)
}

async function loadDashboard({ silent = false } = {}) {
  if (!silent) setStatus('Refreshing dashboard data...', 'neutral')

  try {
    const [health, airports, gates, aircraft, flights, passengers, tickets, baggage] = await fetchDashboardData()

    Object.assign(state, {
      health,
      airports,
      gates,
      aircraft,
      flights,
      passengers,
      tickets,
      baggage,
      searchResults: flights.slice(0, 8),
    })

    refreshView()
    setStatus(`Backend healthy. Last sync ${formatDateTime(health.timestamp)}`, 'success')
  } catch (error) {
    console.error(error)
    setStatus(`Unable to reach backend: ${error.message}`, 'danger')
  }
}

function bindCreateForm(formId, endpoint, transformBody) {
  const form = document.querySelector(formId)
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const rawBody = serializeForm(form)
    const body = transformBody ? transformBody(rawBody) : rawBody

    try {
      setStatus(`Submitting ${endpoint.replace('/api/', '')}...`, 'neutral')
      await fetchJson(endpoint, { method: 'POST', body: JSON.stringify(body) })
      form.reset()
      await loadDashboard({ silent: true })
      setStatus('Record created successfully.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })
}

function bindToolForms() {
  document.querySelector('#flight-search-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
      const params = new URLSearchParams(serializeForm(event.currentTarget))
      state.searchResults = await fetchJson(`${API_BASE}/flights/search?${params.toString()}`)
      renderResults(state)
      setStatus('Flight search complete.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })

  document.querySelector('#airport-schedule-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = serializeForm(event.currentTarget)
    if (!values.airportId || !values.date) return

    try {
      state.airportSchedule = await fetchJson(`${API_BASE}/flights/airport/${values.airportId}?date=${encodeURIComponent(values.date)}`)
      renderResults(state)
      setStatus('Airport schedule loaded.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })

  document.querySelector('#gate-window-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = serializeForm(event.currentTarget)
    if (!values.gateId || !values.start || !values.end) return

    try {
      const start = encodeURIComponent(toBackendDateTime(values.start))
      const end = encodeURIComponent(toBackendDateTime(values.end))
      state.gateWindow = await fetchJson(`${API_BASE}/flights/gate/${values.gateId}?start=${start}&end=${end}`)
      renderResults(state)
      setStatus('Gate usage loaded.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })

  document.querySelector('#manifest-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = serializeForm(event.currentTarget)
    if (!values.flightId) return

    try {
      state.manifest = await fetchJson(`${API_BASE}/flights/${values.flightId}/passengers`)
      renderResults(state)
      setStatus('Passenger manifest loaded.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })

  document.querySelector('#baggage-flight-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = serializeForm(event.currentTarget)
    if (!values.flightId) return

    try {
      state.baggageByFlight = await fetchJson(`${API_BASE}/baggage/flight/${values.flightId}`)
      renderResults(state)
      setStatus('Baggage list loaded.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })

  document.querySelector('#undelivered-baggage-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = serializeForm(event.currentTarget)
    if (!values.flightId) return

    try {
      state.undeliveredBaggage = await fetchJson(`${API_BASE}/baggage/flight/${values.flightId}/undelivered`)
      renderResults(state)
      setStatus('Undelivered baggage loaded.', 'success')
    } catch (error) {
      console.error(error)
      setStatus(error.message, 'danger')
    }
  })
}

function bindActionButtons() {
  document.addEventListener('click', async (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    if (target.dataset.action === 'refresh-dashboard') {
      await loadDashboard()
    }

    if (target.dataset.action === 'update-flight-status') {
      const select = document.querySelector(`[data-flight-status-select="${target.dataset.flightId}"]`)
      if (!(select instanceof HTMLSelectElement)) return

      try {
        await fetchJson(`${API_BASE}/flights/${target.dataset.flightId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ Status: select.value }),
        })
        await loadDashboard({ silent: true })
        setStatus('Flight status updated.', 'success')
      } catch (error) {
        console.error(error)
        setStatus(error.message, 'danger')
      }
    }

    if (target.dataset.action === 'update-baggage-status') {
      const select = document.querySelector(`[data-baggage-status-select="${target.dataset.baggageId}"]`)
      if (!(select instanceof HTMLSelectElement)) return

      try {
        await fetchJson(`${API_BASE}/baggage/${target.dataset.baggageId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ Status: select.value }),
        })
        await loadDashboard({ silent: true })
        setStatus('Baggage status updated.', 'success')
      } catch (error) {
        console.error(error)
        setStatus(error.message, 'danger')
      }
    }
  })
}

function bindCreateForms() {
  bindCreateForm('#airport-create-form', `${API_BASE}/airports`, (body) => ({ ...body, IATACode: body.IATACode?.toUpperCase() }))
  bindCreateForm('#gate-create-form', `${API_BASE}/gates`, (body) => ({ ...body, AirportID: Number(body.AirportID) }))
  bindCreateForm('#aircraft-create-form', `${API_BASE}/aircraft`, (body) => ({ ...body, Capacity: Number(body.Capacity) }))
  bindCreateForm('#flight-create-form', `${API_BASE}/flights`, (body) => ({
    ...body,
    AircraftID: Number(body.AircraftID),
    DepartureAirportID: Number(body.DepartureAirportID),
    ArrivalAirportID: Number(body.ArrivalAirportID),
    GateID: Number(body.GateID),
    DepartureTime: toBackendDateTime(body.DepartureTime),
    ActualDepartureTime: toBackendDateTime(body.ActualDepartureTime),
  }))
  bindCreateForm('#passenger-create-form', `${API_BASE}/passengers`)
  bindCreateForm('#ticket-create-form', `${API_BASE}/tickets`, (body) => ({
    ...body,
    PassengerID: Number(body.PassengerID),
    FlightID: Number(body.FlightID),
  }))
  bindCreateForm('#baggage-create-form', `${API_BASE}/baggage`, (body) => ({
    ...body,
    Weight: Number(body.Weight),
    TicketID: Number(body.TicketID),
  }))
}

export function initApp(app) {
  app.innerHTML = getAppMarkup()
  bindToolForms()
  bindActionButtons()
  bindCreateForms()
  loadDashboard()
}
