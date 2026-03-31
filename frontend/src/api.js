import { API_BASE, HEALTH_URL } from './constants'

export async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.error ? payload.error : response.statusText
    throw new Error(message || 'Request failed')
  }

  return payload
}

export function fetchDashboardData() {
  return Promise.all([
    fetchJson(HEALTH_URL),
    fetchJson(`${API_BASE}/airports`),
    fetchJson(`${API_BASE}/gates`),
    fetchJson(`${API_BASE}/aircraft`),
    fetchJson(`${API_BASE}/flights`),
    fetchJson(`${API_BASE}/passengers`),
    fetchJson(`${API_BASE}/tickets`),
    fetchJson(`${API_BASE}/baggage`),
  ])
}
