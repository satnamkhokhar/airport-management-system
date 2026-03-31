import { baggageStatuses, flightStatuses } from './constants'
import { escapeHtml, formatDateTime } from './utils'

function createOptions(items, placeholder) {
  const options = items.map((item) => `<option value="${item.value}">${escapeHtml(item.label)}</option>`).join('')
  return placeholder ? `<option value="">${escapeHtml(placeholder)}</option>${options}` : options
}

function createMetricCard(label, value, detail) {
  return `
    <article class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `
}

function createTable(data, columns, emptyMessage = 'No records found.') {
  if (!data.length) {
    return `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`
  }

  const header = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')
  const rows = data.map((row) => {
    const cells = columns.map((column) => {
      const value = typeof column.render === 'function' ? column.render(row) : row[column.key]
      return `<td>${value ?? ''}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${header}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

function flightStatusControl(flight) {
  const options = flightStatuses.map((status) => `
    <option value="${status}" ${flight.Status === status ? 'selected' : ''}>${status}</option>
  `).join('')

  return `
    <div class="status-control">
      <select data-flight-status-select="${flight.FlightID}">${options}</select>
      <button class="ghost-button" data-action="update-flight-status" data-flight-id="${flight.FlightID}" type="button">Update</button>
    </div>
  `
}

function baggageStatusControl(bag) {
  const options = baggageStatuses.map((status) => `
    <option value="${status}" ${bag.Status === status ? 'selected' : ''}>${status}</option>
  `).join('')

  return `
    <div class="status-control">
      <select data-baggage-status-select="${bag.BaggageID}">${options}</select>
      <button class="ghost-button" data-action="update-baggage-status" data-baggage-id="${bag.BaggageID}" type="button">Update</button>
    </div>
  `
}

function setText(selector, value) {
  document.querySelector(selector).textContent = String(value)
}

function renderResultSet(containerSelector, countSelector, data, columns, emptyMessage) {
  document.querySelector(containerSelector).innerHTML = createTable(data, columns, emptyMessage)
  document.querySelector(countSelector).textContent = `${data.length} result${data.length === 1 ? '' : 's'}`
}

function createBarList(items, { valueLabel, maxValue, emptyMessage }) {
  if (!items.length) {
    return `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`
  }

  return `
    <div class="bar-list">
      ${items.map((item) => {
        const width = maxValue > 0 ? Math.max((item.value / maxValue) * 100, 8) : 0
        return `
          <div class="bar-item">
            <div class="bar-item-head">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(valueLabel(item))}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${width}%"></div>
            </div>
            ${item.subtext ? `<small>${escapeHtml(item.subtext)}</small>` : ''}
          </div>
        `
      }).join('')}
    </div>
  `
}

export function setStatus(message, tone = 'neutral') {
  const pill = document.querySelector('#status-pill')
  pill.textContent = message
  pill.dataset.tone = tone
}

export function renderSelects(state) {
  const airlineOptions = [...new Set(state.flights.map((flight) => flight.Airline).filter(Boolean))]
    .sort()
    .map((airline) => ({ value: airline, label: airline }))

  const selectGroups = [
    {
      selectors: ['#flight-airline-select'],
      items: airlineOptions,
      placeholder: 'Any airline',
    },
    {
      selectors: ['#airport-schedule-select', '#gate-airport-select', '#flight-departure-select', '#flight-arrival-select'],
      items: state.airports.map((airport) => ({ value: airport.AirportID, label: `${airport.IATACode} - ${airport.Name}` })),
      placeholder: 'Select airport',
    },
    {
      selectors: ['#gate-window-select', '#flight-gate-select'],
      items: state.gates.map((gate) => ({ value: gate.GateID, label: `${gate.GateNumber} - ${gate.IATACode || ''} ${gate.AirportName || ''}`.trim() })),
      placeholder: 'Select gate',
    },
    {
      selectors: ['#flight-aircraft-select'],
      items: state.aircraft.map((aircraft) => ({ value: aircraft.AircraftID, label: `${aircraft.TailNumber} - ${aircraft.Model}` })),
      placeholder: 'Select aircraft',
    },
    {
      selectors: ['#manifest-flight-select', '#baggage-flight-select', '#undelivered-flight-select', '#ticket-flight-select'],
      items: state.flights.map((flight) => ({
        value: flight.FlightID,
        label: `${flight.FlightNumber} ${flight.DepartureIATA || ''}->${flight.ArrivalIATA || ''} ${formatDateTime(flight.DepartureTime)}`,
      })),
      placeholder: 'Select flight',
    },
    {
      selectors: ['#ticket-passenger-select'],
      items: state.passengers.map((passenger) => ({ value: passenger.PassengerID, label: `${passenger.FirstName} ${passenger.LastName}` })),
      placeholder: 'Select passenger',
    },
    {
      selectors: ['#baggage-ticket-select'],
      items: state.tickets.map((ticket) => ({
        value: ticket.TicketID,
        label: `${ticket.SeatNumber} - ${ticket.FirstName || ''} ${ticket.LastName || ''} - ${ticket.FlightNumber || ''}`.replace(/\s+/g, ' ').trim(),
      })),
      placeholder: 'Select ticket',
    },
  ]

  selectGroups.forEach(({ selectors, items, placeholder }) => {
    selectors.forEach((selector) => {
      const select = document.querySelector(selector)
      if (!select) return
      const currentValue = select.value
      select.innerHTML = createOptions(items, placeholder)
      if (currentValue && items.some((item) => String(item.value) === currentValue)) {
        select.value = currentValue
      }
    })
  })
}

export function renderSummary(state) {
  const delayedFlights = state.flights.filter((flight) => flight.Status === 'Delayed').length
  const cancelledFlights = state.flights.filter((flight) => flight.Status === 'Cancelled').length
  const deliveredBags = state.baggage.filter((bag) => bag.Status === 'Delivered').length
  const outstandingBags = state.baggage.length - deliveredBags

  document.querySelector('#summary-cards').innerHTML = [
    createMetricCard('Flights', state.flights.length, `${delayedFlights} delayed, ${cancelledFlights} cancelled`),
    createMetricCard('Gates', state.gates.length, `${state.airports.length} airports in network`),
    createMetricCard('Passengers', state.passengers.length, `${state.tickets.length} active tickets`),
    createMetricCard('Baggage', state.baggage.length, `${outstandingBags} still in process`),
  ].join('')
}

export function renderAnalytics(state) {
  const gateCounts = Object.values(state.flights.reduce((acc, flight) => {
    const key = flight.GateID
    if (!acc[key]) {
      acc[key] = {
        label: `${flight.GateNumber || `Gate ${flight.GateID}`}`,
        value: 0,
        subtext: `${flight.DepartureIATA || ''} departures`.trim(),
      }
    }
    acc[key].value += 1
    return acc
  }, {})).sort((a, b) => b.value - a.value)

  const airlineDelayMap = state.flights.reduce((acc, flight) => {
    const key = flight.Airline || 'Unknown'
    if (!acc[key]) acc[key] = { airline: key, total: 0, delayed: 0, totalDelayMinutes: 0, measuredDelays: 0 }
    acc[key].total += 1
    if (flight.Status === 'Delayed') {
      acc[key].delayed += 1
      if (flight.ActualDepartureTime && flight.DepartureTime) {
        const minutes = Math.max(
          0,
          Math.round((new Date(flight.ActualDepartureTime).getTime() - new Date(flight.DepartureTime).getTime()) / 60000),
        )
        acc[key].totalDelayMinutes += minutes
        acc[key].measuredDelays += 1
      }
    }
    return acc
  }, {})

  const airlineDelays = Object.values(airlineDelayMap).map((entry) => {
    const delayRate = entry.total ? (entry.delayed / entry.total) * 100 : 0
    const avgDelay = entry.measuredDelays ? Math.round(entry.totalDelayMinutes / entry.measuredDelays) : 0
    return {
      label: entry.airline,
      value: delayRate,
      delayedFlights: entry.delayed,
      avgDelay,
      subtext: `${entry.delayed} delayed of ${entry.total} flights, ${avgDelay} avg delay min`,
    }
  }).sort((a, b) => b.value - a.value)

  const aircraftUse = Object.values(state.flights.reduce((acc, flight) => {
    const key = flight.AircraftID
    if (!acc[key]) {
      acc[key] = {
        label: flight.TailNumber || `Aircraft ${flight.AircraftID}`,
        value: 0,
        subtext: flight.AircraftModel || 'Aircraft utilization',
      }
    }
    acc[key].value += 1
    return acc
  }, {})).sort((a, b) => b.value - a.value)

  const ticketsByFlight = state.tickets.reduce((acc, ticket) => {
    acc[ticket.FlightID] = (acc[ticket.FlightID] || 0) + 1
    return acc
  }, {})

  const loadFactors = state.flights
    .filter((flight) => Number(flight.Capacity || flight.capacity || 0) > 0 || Number(flight.AircraftID))
    .map((flight) => {
      const capacity = Number(flight.Capacity || state.aircraft.find((item) => item.AircraftID === flight.AircraftID)?.Capacity || 0)
      const booked = ticketsByFlight[flight.FlightID] || 0
      const load = capacity ? (booked / capacity) * 100 : 0
      return {
        label: flight.FlightNumber,
        value: load,
        subtext: `${booked}/${capacity || 0} seats booked`,
      }
    })
    .sort((a, b) => b.value - a.value)

  const topGate = gateCounts[0]
  const topDelayAirline = airlineDelays[0]
  const topAircraft = aircraftUse[0]
  const topLoad = loadFactors[0]

  document.querySelector('#analytics-top-gate').textContent = topGate ? topGate.label : 'No flight data'
  document.querySelector('#analytics-top-gate-detail').textContent = topGate ? `${topGate.value} flights in current dataset` : 'Add flights to compute gate traffic'
  document.querySelector('#analytics-top-delay-airline').textContent = topDelayAirline ? topDelayAirline.label : 'No delay data'
  document.querySelector('#analytics-top-delay-airline-detail').textContent = topDelayAirline ? `${topDelayAirline.delayedFlights} delays, ${Math.round(topDelayAirline.value)}% delay rate` : 'Add delayed flights to compute statistics'
  document.querySelector('#analytics-top-aircraft').textContent = topAircraft ? topAircraft.label : 'No aircraft data'
  document.querySelector('#analytics-top-aircraft-detail').textContent = topAircraft ? `${topAircraft.value} flights assigned` : 'Assign flights to aircraft to measure utilization'
  document.querySelector('#analytics-top-load').textContent = topLoad ? topLoad.label : 'No ticket data'
  document.querySelector('#analytics-top-load-detail').textContent = topLoad ? `${Math.round(topLoad.value)}% load factor` : 'Issue tickets to calculate load factors'

  document.querySelector('#analytics-gates').innerHTML = createBarList(gateCounts.slice(0, 5), {
    valueLabel: (item) => `${item.value} flights`,
    maxValue: gateCounts[0]?.value || 0,
    emptyMessage: 'No flight activity available for gate analytics.',
  })

  document.querySelector('#analytics-delays').innerHTML = createBarList(airlineDelays.slice(0, 5), {
    valueLabel: (item) => `${Math.round(item.value)}%`,
    maxValue: airlineDelays[0]?.value || 0,
    emptyMessage: 'No airline delay data available.',
  })

  document.querySelector('#analytics-aircraft').innerHTML = createBarList(aircraftUse.slice(0, 5), {
    valueLabel: (item) => `${item.value} flights`,
    maxValue: aircraftUse[0]?.value || 0,
    emptyMessage: 'No aircraft assignments available.',
  })

  document.querySelector('#analytics-load').innerHTML = createBarList(loadFactors.slice(0, 5), {
    valueLabel: (item) => `${Math.round(item.value)}%`,
    maxValue: 100,
    emptyMessage: 'No ticket and capacity data available for load factors.',
  })
}

export function renderTables(state) {
  setText('#flights-count', state.flights.length)
  setText('#airports-count', state.airports.length)
  setText('#gates-count', state.gates.length)
  setText('#aircraft-count', state.aircraft.length)
  setText('#passengers-count', state.passengers.length)
  setText('#tickets-count', state.tickets.length)
  setText('#baggage-count', state.baggage.length)

  document.querySelector('#flights-table').innerHTML = createTable(state.flights, [
    { label: 'Flight', render: (row) => `<strong>${escapeHtml(row.FlightNumber)}</strong><br><span class="muted">${escapeHtml(row.Airline)}</span>` },
    { label: 'Route', render: (row) => `${escapeHtml(row.DepartureIATA)} -> ${escapeHtml(row.ArrivalIATA)}` },
    { label: 'Departure', render: (row) => formatDateTime(row.DepartureTime) },
    { label: 'Aircraft', render: (row) => `${escapeHtml(row.TailNumber)}<br><span class="muted">${escapeHtml(row.AircraftModel)}</span>` },
    { label: 'Gate', key: 'GateNumber' },
    { label: 'Status', render: flightStatusControl },
  ], 'No flights scheduled yet.')

  document.querySelector('#airports-table').innerHTML = createTable(state.airports, [
    { label: 'ID', key: 'AirportID' },
    { label: 'Airport', render: (row) => `<strong>${escapeHtml(row.Name)}</strong><br><span class="muted">${escapeHtml(row.Location)}</span>` },
    { label: 'IATA', key: 'IATACode' },
  ])

  document.querySelector('#gates-table').innerHTML = createTable(state.gates, [
    { label: 'Gate', key: 'GateNumber' },
    { label: 'Airport', render: (row) => `${escapeHtml(row.IATACode)}<br><span class="muted">${escapeHtml(row.AirportName)}</span>` },
  ])

  document.querySelector('#aircraft-table').innerHTML = createTable(state.aircraft, [
    { label: 'Tail', key: 'TailNumber' },
    { label: 'Model', key: 'Model' },
    { label: 'Capacity', key: 'Capacity' },
  ])

  document.querySelector('#passengers-table').innerHTML = createTable(state.passengers, [
    { label: 'ID', key: 'PassengerID' },
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
  ])

  document.querySelector('#tickets-table').innerHTML = createTable(state.tickets, [
    { label: 'Ticket', key: 'TicketID' },
    { label: 'Seat', key: 'SeatNumber' },
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
    { label: 'Flight', render: (row) => `${escapeHtml(row.FlightNumber)}<br><span class="muted">${escapeHtml(row.Airline)}</span>` },
  ])

  document.querySelector('#baggage-table').innerHTML = createTable(state.baggage, [
    { label: 'Bag', key: 'BaggageID' },
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
    { label: 'Seat', key: 'SeatNumber' },
    { label: 'Weight', render: (row) => `${escapeHtml(row.Weight)} kg` },
    { label: 'Status', render: baggageStatusControl },
  ])
}

export function renderResults(state) {
  renderResultSet('#search-results', '#search-result-count', state.searchResults, [
    { label: 'Flight', render: (row) => `${escapeHtml(row.FlightNumber)}<br><span class="muted">${escapeHtml(row.Airline)}</span>` },
    { label: 'Route', render: (row) => `${escapeHtml(row.DepartureIATA)} -> ${escapeHtml(row.ArrivalIATA)}` },
    { label: 'Status', key: 'Status' },
    { label: 'Departure', render: (row) => formatDateTime(row.DepartureTime) },
    { label: 'Gate', key: 'GateNumber' },
  ], 'Search flights by airline, status, or date.')

  renderResultSet('#airport-schedule-results', '#airport-schedule-count', state.airportSchedule, [
    { label: 'Flight', render: (row) => `${escapeHtml(row.FlightNumber)}<br><span class="muted">${escapeHtml(row.Airline)}</span>` },
    { label: 'Route', render: (row) => `${escapeHtml(row.DepartureIATA)} -> ${escapeHtml(row.ArrivalIATA)}` },
    { label: 'Departure', render: (row) => formatDateTime(row.DepartureTime) },
    { label: 'Gate', key: 'GateNumber' },
    { label: 'Status', key: 'Status' },
  ], 'Choose an airport and date to view its schedule.')

  renderResultSet('#gate-window-results', '#gate-window-count', state.gateWindow, [
    { label: 'Flight', render: (row) => `${escapeHtml(row.FlightNumber)}<br><span class="muted">${escapeHtml(row.Airline)}</span>` },
    { label: 'Status', key: 'Status' },
    { label: 'Departure', render: (row) => formatDateTime(row.DepartureTime) },
    { label: 'Actual departure', render: (row) => formatDateTime(row.ActualDepartureTime) },
  ], 'Select a gate and time window to inspect usage.')

  renderResultSet('#manifest-results', '#manifest-count', state.manifest, [
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
    { label: 'Ticket', key: 'TicketID' },
    { label: 'Seat', key: 'SeatNumber' },
  ], 'Pick a flight to load the passenger manifest.')

  renderResultSet('#baggage-flight-results', '#baggage-flight-count', state.baggageByFlight, [
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
    { label: 'Seat', key: 'SeatNumber' },
    { label: 'Weight', render: (row) => `${escapeHtml(row.Weight)} kg` },
    { label: 'Status', key: 'Status' },
  ], 'Pick a flight to inspect baggage handling.')

  renderResultSet('#undelivered-results', '#undelivered-count', state.undeliveredBaggage, [
    { label: 'Passenger', render: (row) => `${escapeHtml(row.FirstName)} ${escapeHtml(row.LastName)}` },
    { label: 'Seat', key: 'SeatNumber' },
    { label: 'Weight', render: (row) => `${escapeHtml(row.Weight)} kg` },
    { label: 'Status', key: 'Status' },
  ], 'Pick a flight to spot undelivered baggage.')
}
