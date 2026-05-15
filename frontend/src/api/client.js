/**
 * Small wrapper around fetch for the Django REST API.
 * Base URL can be overridden with VITE_API_BASE_URL in .env
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data.detail ||
      Object.values(data)
        .flat()
        .join(' ') ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`)
  return parseResponse(response)
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

/** DRF paginated lists use { results: [...] }; plain arrays pass through. */
export function unwrapList(data) {
  return Array.isArray(data) ? data : (data.results ?? [])
}