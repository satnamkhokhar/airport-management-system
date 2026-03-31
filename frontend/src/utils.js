export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function formatDateTime(value) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function toBackendDateTime(value) {
  return value ? `${value}:00` : null
}

export function serializeForm(form) {
  const entries = Object.fromEntries(new FormData(form).entries())
  Object.keys(entries).forEach((key) => {
    if (entries[key] === '') delete entries[key]
  })
  return entries
}
