import { fetchJson, fetchDashboardData } from './api'
import { API_BASE, initialState } from './constants'
import { renderAnalytics, renderResults, renderSelects, renderSummary, renderTables, setStatus } from './render'
import { getAppMarkup } from './template'
import { formatDateTime, serializeForm, toBackendDateTime } from './utils'

const state = { ...initialState }

const recordConfigs = {
  airport: {
    stateKey: 'airports',
    idKey: 'AirportID',
    endpoint: `${API_BASE}/airports`,
    formId: '#airport-create-form',
    title: 'Add airport',
    editTitle: 'Edit airport',
    createLabel: 'Create airport',
    updateLabel: 'Update airport',
    createNote: 'Create a new airport record.',
    editNote: 'Editing an existing airport record.',
    transformBody: (body) => ({ ...body, IATACode: body.IATACode?.toUpperCase() }),
    fillForm: (form, record) => {
      form.elements.Name.value = record.Name || ''
      form.elements.Location.value = record.Location || ''
      form.elements.IATACode.value = record.IATACode || ''
    },
  },
  gate: {
    stateKey: 'gates',
    idKey: 'GateID',
    endpoint: `${API_BASE}/gates`,
    formId: '#gate-create-form',
    title: 'Add gate',
    editTitle: 'Edit gate',
    createLabel: 'Create gate',
    updateLabel: 'Update gate',
    createNote: 'Create a new gate record.',
    editNote: 'Editing an existing gate record.',
    transformBody: (body) => ({ ...body, AirportID: Number(body.AirportID) }),
    fillForm: (form, record) => {
      form.elements.GateNumber.value = record.GateNumber || ''
      form.elements.AirportID.value = String(record.AirportID || '')
    },
  },
  aircraft: {
    stateKey: 'aircraft',
    idKey: 'AircraftID',
    endpoint: `${API_BASE}/aircraft`,
    formId: '#aircraft-create-form',
    title: 'Add aircraft',
    editTitle: 'Edit aircraft',
    createLabel: 'Create aircraft',
    updateLabel: 'Update aircraft',
    createNote: 'Create a new aircraft record.',
    editNote: 'Editing an existing aircraft record.',
    transformBody: (body) => ({ ...body, Capacity: Number(body.Capacity) }),
    fillForm: (form, record) => {
      form.elements.TailNumber.value = record.TailNumber || ''
      form.elements.Model.value = record.Model || ''
      form.elements.Capacity.value = String(record.Capacity || '')
    },
  },
  flight: {
    stateKey: 'flights',
    idKey: 'FlightID',
    endpoint: `${API_BASE}/flights`,
    formId: '#flight-create-form',
    title: 'Schedule flight',
    editTitle: 'Edit flight',
    createLabel: 'Create flight',
    updateLabel: 'Update flight',
    createNote: 'Create a new flight record.',
    editNote: 'Editing an existing flight record.',
    transformBody: (body) => ({
      ...body,
      AircraftID: Number(body.AircraftID),
      DepartureAirportID: Number(body.DepartureAirportID),
      ArrivalAirportID: Number(body.ArrivalAirportID),
      GateID: Number(body.GateID),
      DepartureTime: toBackendDateTime(body.DepartureTime),
      ActualDepartureTime: toBackendDateTime(body.ActualDepartureTime),
    }),
    fillForm: (form, record) => {
      form.elements.FlightNumber.value = record.FlightNumber || ''
      form.elements.Airline.value = record.Airline || ''
      form.elements.Status.value = record.Status || 'On Time'
      form.elements.DepartureTime.value = toInputDateTime(record.DepartureTime)
      form.elements.ActualDepartureTime.value = toInputDateTime(record.ActualDepartureTime)
      form.elements.AircraftID.value = String(record.AircraftID || '')
      form.elements.DepartureAirportID.value = String(record.DepartureAirportID || '')
      form.elements.ArrivalAirportID.value = String(record.ArrivalAirportID || '')
      form.elements.GateID.value = String(record.GateID || '')
    },
  },
  passenger: {
    stateKey: 'passengers',
    idKey: 'PassengerID',
    endpoint: `${API_BASE}/passengers`,
    formId: '#passenger-create-form',
    title: 'Add passenger',
    editTitle: 'Edit passenger',
    createLabel: 'Create passenger',
    updateLabel: 'Update passenger',
    createNote: 'Create a new passenger record.',
    editNote: 'Editing an existing passenger record.',
    fillForm: (form, record) => {
      form.elements.FirstName.value = record.FirstName || ''
      form.elements.LastName.value = record.LastName || ''
    },
  },
  ticket: {
    stateKey: 'tickets',
    idKey: 'TicketID',
    endpoint: `${API_BASE}/tickets`,
    formId: '#ticket-create-form',
    title: 'Issue ticket',
    editTitle: 'Edit ticket',
    createLabel: 'Create ticket',
    updateLabel: 'Update ticket',
    createNote: 'Create a new ticket record.',
    editNote: 'Editing an existing ticket record.',
    transformBody: (body) => ({
      ...body,
      PassengerID: Number(body.PassengerID),
      FlightID: Number(body.FlightID),
    }),
    fillForm: (form, record) => {
      form.elements.SeatNumber.value = record.SeatNumber || ''
      form.elements.PassengerID.value = String(record.PassengerID || '')
      form.elements.FlightID.value = String(record.FlightID || '')
    },
  },
  baggage: {
    stateKey: 'baggage',
    idKey: 'BaggageID',
    endpoint: `${API_BASE}/baggage`,
    formId: '#baggage-create-form',
    title: 'Check baggage',
    editTitle: 'Edit baggage',
    createLabel: 'Create baggage record',
    updateLabel: 'Update baggage record',
    createNote: 'Create a new baggage record.',
    editNote: 'Editing an existing baggage record.',
    transformBody: (body) => ({
      ...body,
      Weight: Number(body.Weight),
      TicketID: Number(body.TicketID),
    }),
    fillForm: (form, record) => {
      form.elements.Weight.value = String(record.Weight || '')
      form.elements.Status.value = record.Status || 'Checked-in'
      form.elements.TicketID.value = String(record.TicketID || '')
    },
  },
}

function refreshView() {
  renderAnalytics(state)
  renderSummary(state)
  renderSelects(state)
  renderTables(state)
  renderResults(state)
}

function toInputDateTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }

  return String(value).replace(' ', 'T').slice(0, 16)
}

function getFormMeta(entity) {
  const config = recordConfigs[entity]
  if (!config) return null

  const form = document.querySelector(config.formId)
  if (!(form instanceof HTMLFormElement)) return null

  return {
    ...config,
    form,
    titleElement: form.querySelector('h3'),
    submitButton: form.querySelector('button[type="submit"]'),
    noteElement: document.querySelector(`[data-form-note="${entity}"]`),
    cancelButton: document.querySelector(`[data-form-cancel="${entity}"]`),
  }
}

function updateFormPresentation(entity, isEditing) {
  const meta = getFormMeta(entity)
  if (!meta) return

  meta.titleElement.textContent = isEditing ? meta.editTitle : meta.title
  meta.submitButton.textContent = isEditing ? meta.updateLabel : meta.createLabel
  if (meta.noteElement) meta.noteElement.textContent = isEditing ? meta.editNote : meta.createNote
  if (meta.cancelButton) meta.cancelButton.hidden = !isEditing
}

function resetFormMode(entity) {
  const meta = getFormMeta(entity)
  if (!meta) return

  meta.form.reset()
  delete meta.form.dataset.mode
  delete meta.form.dataset.recordId
  updateFormPresentation(entity, false)
  renderSelects(state)
}

function startEditingRecord(entity, recordId) {
  const meta = getFormMeta(entity)
  if (!meta) return

  const record = state[meta.stateKey].find((item) => String(item[meta.idKey]) === String(recordId))
  if (!record) {
    setStatus('Unable to load that record for editing.', 'danger')
    return
  }

  meta.form.dataset.mode = 'edit'
  meta.form.dataset.recordId = String(recordId)
  updateFormPresentation(entity, true)
  meta.fillForm(meta.form, record)
  meta.form.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

function bindRecordForms() {
  Object.keys(recordConfigs).forEach((entity) => {
    const meta = getFormMeta(entity)
    if (!meta) return

    updateFormPresentation(entity, false)

    meta.form.addEventListener('submit', async (event) => {
      event.preventDefault()

      const rawBody = serializeForm(meta.form)
      const body = meta.transformBody ? meta.transformBody(rawBody) : rawBody
      const isEditing = meta.form.dataset.mode === 'edit'
      const recordId = meta.form.dataset.recordId
      const requestPath = isEditing ? `${meta.endpoint}/${recordId}` : meta.endpoint
      const requestMethod = isEditing ? 'PUT' : 'POST'

      try {
        setStatus(`${isEditing ? 'Updating' : 'Submitting'} ${meta.endpoint.replace('/api/', '')}...`, 'neutral')
        await fetchJson(requestPath, { method: requestMethod, body: JSON.stringify(body) })
        resetFormMode(entity)
        await loadDashboard({ silent: true })
        setStatus(isEditing ? 'Record updated successfully.' : 'Record created successfully.', 'success')
      } catch (error) {
        console.error(error)
        setStatus(error.message, 'danger')
      }
    })

    meta.cancelButton?.addEventListener('click', () => {
      resetFormMode(entity)
      setStatus('Edit cancelled.', 'neutral')
    })
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
      return
    }

    if (target.dataset.action === 'edit-record') {
      startEditingRecord(target.dataset.entity, target.dataset.recordId)
      return
    }

    if (target.dataset.action === 'delete-record') {
      const { entity, recordId } = target.dataset
      const meta = recordConfigs[entity]
      if (!meta || !recordId) return

      const confirmed = window.confirm(`Delete this ${entity} record? This action cannot be undone.`)
      if (!confirmed) return

      try {
        setStatus(`Deleting ${entity} record...`, 'neutral')
        await fetchJson(`${meta.endpoint}/${recordId}`, { method: 'DELETE' })
        if (getFormMeta(entity)?.form.dataset.recordId === recordId) resetFormMode(entity)
        await loadDashboard({ silent: true })
        setStatus('Record deleted successfully.', 'success')
      } catch (error) {
        console.error(error)
        setStatus(error.message, 'danger')
      }
      return
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
      return
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

export function initApp(app) {
  app.innerHTML = getAppMarkup()
  bindToolForms()
  bindActionButtons()
  bindRecordForms()
  loadDashboard()
}
