export async function adminRequest(method = 'GET', body) {
  const response = await fetch('/api/admin', {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(result.error || 'The request could not be completed.')
    error.status = response.status
    throw error
  }
  return result
}