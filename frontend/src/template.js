import { baggageStatuses, flightStatuses } from './constants'

export function getAppMarkup() {
  return `
    <div class="site-shell">
      <section class="analytics-banner">
        <div class="analytics-banner-copy">
          <p class="eyebrow">Advanced function</p>
          <h2>Airport Traffic Analytics</h2>
          <p class="lede">
            This section uses the data in the system to show airport activity, including busy gates, airline delays, aircraft usage, and passenger load factors.
          </p>
        </div>
        <div class="analytics-banner-grid">
          <article class="analytics-stat">
            <span>Busiest gate</span>
            <strong id="analytics-top-gate">Waiting for data</strong>
            <small id="analytics-top-gate-detail">Load backend records to compute traffic</small>
          </article>
          <article class="analytics-stat">
            <span>Highest delay rate</span>
            <strong id="analytics-top-delay-airline">Waiting for data</strong>
            <small id="analytics-top-delay-airline-detail">Delay analytics will appear here</small>
          </article>
          <article class="analytics-stat">
            <span>Most utilized aircraft</span>
            <strong id="analytics-top-aircraft">Waiting for data</strong>
            <small id="analytics-top-aircraft-detail">Utilization analytics will appear here</small>
          </article>
          <article class="analytics-stat">
            <span>Highest load factor</span>
            <strong id="analytics-top-load">Waiting for data</strong>
            <small id="analytics-top-load-detail">Passenger load analytics will appear here</small>
          </article>
        </div>
      </section>

      <section class="panel analytics-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Airport traffic analytics</p>
            <h2>Analytics based on flights, gates, tickets, baggage, and aircraft data</h2>
          </div>
        </div>
        <div class="analytics-grid">
          <article class="result-card">
            <div class="result-header">
              <h3>Busiest gates</h3>
              <span class="muted">Flights handled</span>
            </div>
            <div id="analytics-gates"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Airline delay statistics</h3>
              <span class="muted">Delayed flights and average minutes</span>
            </div>
            <div id="analytics-delays"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Aircraft utilization</h3>
              <span class="muted">Flights per aircraft</span>
            </div>
            <div id="analytics-aircraft"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Passenger load factors</h3>
              <span class="muted">Booked seats vs capacity</span>
            </div>
            <div id="analytics-load"></div>
          </article>
        </div>
      </section>

      <header class="site-header">
        <div class="brand-lockup">
          <div class="brand-mark">G</div>
          <div>
            <p class="brand-kicker">TS Project</p>
            <h1 class="brand-title">Airport Admin Dashboard</h1>
          </div>
        </div>
        <nav class="site-nav" aria-label="Primary">
          <a href="#hero">Overview</a>
          <a href="#operations">Operations</a>
          <a href="#actions">Records</a>
          <a href="#reference">System data</a>
        </nav>
      </header>

      <section class="hero-panel" id="hero">
        <div class="hero-copy">
          <p class="eyebrow">Airport management dashboard</p>
          <h2>Manage flights, gates, passengers, tickets, and baggage.</h2>
          <p class="lede">
            Use this dashboard to check airport activity, view schedules and manifests, and create records in the system.
          </p>
          <div class="hero-actions">
            <button class="primary-button" data-action="refresh-dashboard">Refresh dashboard data</button>
            <span id="status-pill" class="status-pill">Loading system state...</span>
          </div>
        </div>
        <aside class="hero-side">
          <div class="hero-side-card">
            <p class="eyebrow">System snapshot</p>
            <div class="hero-grid" id="summary-cards"></div>
          </div>
        </aside>
      </section>

      <section class="panel" id="operations">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Operations tools</p>
            <h2>View flight activity, gate usage, baggage flow, and passenger manifests</h2>
          </div>
        </div>
        <div class="ops-grid">
          <form class="tool-card" id="flight-search-form">
            <h3>Flight search</h3>
            <label>
              Airline
              <select name="airline" id="flight-airline-select"></select>
            </label>
            <label>
              Status
              <select name="status">
                <option value="">Any status</option>
                ${flightStatuses.map((status) => `<option value="${status}">${status}</option>`).join('')}
              </select>
            </label>
            <label>
              Departure date
              <input name="date" type="date" />
            </label>
            <button class="secondary-button" type="submit">Search flights</button>
          </form>

          <form class="tool-card" id="airport-schedule-form">
            <h3>Airport schedule</h3>
            <label>
              Airport
              <select name="airportId" id="airport-schedule-select"></select>
            </label>
            <label>
              Date
              <input name="date" type="date" required />
            </label>
            <button class="secondary-button" type="submit">Load schedule</button>
          </form>

          <form class="tool-card" id="gate-window-form">
            <h3>Gate activity</h3>
            <label>
              Gate
              <select name="gateId" id="gate-window-select"></select>
            </label>
            <label>
              Start
              <input name="start" type="datetime-local" required />
            </label>
            <label>
              End
              <input name="end" type="datetime-local" required />
            </label>
            <button class="secondary-button" type="submit">Check gate</button>
          </form>

          <form class="tool-card" id="manifest-form">
            <h3>Passenger list</h3>
            <label>
              Flight
              <select name="flightId" id="manifest-flight-select"></select>
            </label>
            <button class="secondary-button" type="submit">Load manifest</button>
          </form>

          <form class="tool-card" id="baggage-flight-form">
            <h3>Baggage status</h3>
            <label>
              Flight
              <select name="flightId" id="baggage-flight-select"></select>
            </label>
            <button class="secondary-button" type="submit">Load baggage</button>
          </form>

          <form class="tool-card" id="undelivered-baggage-form">
            <h3>Bag exceptions</h3>
            <label>
              Flight
              <select name="flightId" id="undelivered-flight-select"></select>
            </label>
            <button class="secondary-button" type="submit">Show undelivered</button>
          </form>
        </div>
      </section>

      <section class="panel" id="actions">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Record management</p>
            <h2>Create and maintain operational records</h2>
          </div>
          <p class="panel-note">Each form sends data to the backend and refreshes the related records.</p>
        </div>
        <div class="form-grid">
          <form class="create-card create-card-featured" id="flight-create-form">
            <h3>Schedule flight</h3>
            <p class="form-mode-note" data-form-note="flight">Create a new flight record.</p>
            <label><span>Flight number</span><input name="FlightNumber" required /></label>
            <label><span>Airline</span><input name="Airline" maxlength="5" required /></label>
            <label><span>Status</span><select name="Status">${flightStatuses.map((status) => `<option value="${status}">${status}</option>`).join('')}</select></label>
            <label><span>Departure time</span><input name="DepartureTime" type="datetime-local" required /></label>
            <label><span>Actual departure</span><input name="ActualDepartureTime" type="datetime-local" /></label>
            <label><span>Aircraft</span><select name="AircraftID" id="flight-aircraft-select"></select></label>
            <label><span>Departure airport</span><select name="DepartureAirportID" id="flight-departure-select"></select></label>
            <label><span>Arrival airport</span><select name="ArrivalAirportID" id="flight-arrival-select"></select></label>
            <label><span>Gate</span><select name="GateID" id="flight-gate-select"></select></label>
            <button class="primary-button" type="submit">Create flight</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="flight" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="airport-create-form">
            <h3>Add airport</h3>
            <p class="form-mode-note" data-form-note="airport">Create a new airport record.</p>
            <label><span>Name</span><input name="Name" required /></label>
            <label><span>Location</span><input name="Location" required /></label>
            <label><span>IATA code</span><input name="IATACode" maxlength="3" required /></label>
            <button class="primary-button" type="submit">Create airport</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="airport" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="ticket-create-form">
            <h3>Issue ticket</h3>
            <p class="form-mode-note" data-form-note="ticket">Create a new ticket record.</p>
            <label><span>Seat number</span><input name="SeatNumber" required /></label>
            <label><span>Passenger</span><select name="PassengerID" id="ticket-passenger-select"></select></label>
            <label><span>Flight</span><select name="FlightID" id="ticket-flight-select"></select></label>
            <button class="primary-button" type="submit">Create ticket</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="ticket" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="baggage-create-form">
            <h3>Check baggage</h3>
            <p class="form-mode-note" data-form-note="baggage">Create a new baggage record.</p>
            <label><span>Weight</span><input name="Weight" type="number" min="0" step="0.01" required /></label>
            <label><span>Status</span><select name="Status">${baggageStatuses.map((status) => `<option value="${status}">${status}</option>`).join('')}</select></label>
            <label><span>Ticket</span><select name="TicketID" id="baggage-ticket-select"></select></label>
            <button class="primary-button" type="submit">Create baggage record</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="baggage" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="aircraft-create-form">
            <h3>Add aircraft</h3>
            <p class="form-mode-note" data-form-note="aircraft">Create a new aircraft record.</p>
            <label><span>Tail number</span><input name="TailNumber" required /></label>
            <label><span>Model</span><input name="Model" required /></label>
            <label><span>Capacity</span><input name="Capacity" type="number" min="1" required /></label>
            <button class="primary-button" type="submit">Create aircraft</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="aircraft" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="passenger-create-form">
            <h3>Add passenger</h3>
            <p class="form-mode-note" data-form-note="passenger">Create a new passenger record.</p>
            <label><span>First name</span><input name="FirstName" required /></label>
            <label><span>Last name</span><input name="LastName" required /></label>
            <button class="primary-button" type="submit">Create passenger</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="passenger" type="button" hidden>Cancel edit</button>
          </form>

          <form class="create-card" id="gate-create-form">
            <h3>Add gate</h3>
            <p class="form-mode-note" data-form-note="gate">Create a new gate record.</p>
            <label><span>Gate number</span><input name="GateNumber" required /></label>
            <label><span>Airport</span><select name="AirportID" id="gate-airport-select"></select></label>
            <button class="primary-button" type="submit">Create gate</button>
            <button class="ghost-button form-cancel-button" data-form-cancel="gate" type="button" hidden>Cancel edit</button>
          </form>
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Live query results</p>
            <h2>Results for status checks, schedules, manifests, and baggage</h2>
          </div>
        </div>
        <div class="result-grid">
          <article class="result-card">
            <div class="result-header">
              <h3>Flight search</h3>
              <span class="muted" id="search-result-count"></span>
            </div>
            <div id="search-results"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Airport schedule</h3>
              <span class="muted" id="airport-schedule-count"></span>
            </div>
            <div id="airport-schedule-results"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Gate usage</h3>
              <span class="muted" id="gate-window-count"></span>
            </div>
            <div id="gate-window-results"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Passenger manifest</h3>
              <span class="muted" id="manifest-count"></span>
            </div>
            <div id="manifest-results"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Baggage on flight</h3>
              <span class="muted" id="baggage-flight-count"></span>
            </div>
            <div id="baggage-flight-results"></div>
          </article>
          <article class="result-card">
            <div class="result-header">
              <h3>Undelivered baggage</h3>
              <span class="muted" id="undelivered-count"></span>
            </div>
            <div id="undelivered-results"></div>
          </article>
        </div>
      </section>

      <section class="panel" id="reference">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">System reference data</p>
            <h2>Airports, aircraft, flights, passengers, tickets, and baggage in the database</h2>
          </div>
        </div>
        <div class="dataset-grid">
          <article class="dataset-card">
            <div class="result-header"><h3>Flights</h3><span class="muted" id="flights-count"></span></div>
            <div id="flights-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Airports</h3><span class="muted" id="airports-count"></span></div>
            <div id="airports-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Gates</h3><span class="muted" id="gates-count"></span></div>
            <div id="gates-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Aircraft</h3><span class="muted" id="aircraft-count"></span></div>
            <div id="aircraft-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Passengers</h3><span class="muted" id="passengers-count"></span></div>
            <div id="passengers-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Tickets</h3><span class="muted" id="tickets-count"></span></div>
            <div id="tickets-table"></div>
          </article>
          <article class="dataset-card">
            <div class="result-header"><h3>Baggage</h3><span class="muted" id="baggage-count"></span></div>
            <div id="baggage-table"></div>
          </article>
        </div>
      </section>
    </div>
  `
}
