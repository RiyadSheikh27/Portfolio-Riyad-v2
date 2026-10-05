import { getStore } from '@netlify/blobs'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const COOKIE_NAME = 'riyad_admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000
const MAX_BODY_SIZE = 1_000_000
const INITIAL_STATE = { transactions: [], tasks: [], notes: [] }

function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

function credentials() {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  }
}

function equalSecret(left, right) {
  const leftHash = createHash('sha256').update(left).digest()
  const rightHash = createHash('sha256').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

function sessionSignature(expiresAt) {
  const { username, password } = credentials()
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET || password)
    .update(`${username}:${expiresAt}`)
    .digest('base64url')
}

function isAuthenticated(request) {
  const { username, password } = credentials()
  if (!username || !password) return false
  const cookie = request.headers.get('cookie') || ''
  const token = cookie.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
  if (!token) return false
  const [expiresAt, signature] = token.split('.')
  if (!/^\d+$/.test(expiresAt || '') || Number(expiresAt) <= Date.now() || !signature) return false
  return equalSecret(signature, sessionSignature(expiresAt))
}

function sessionCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

async function readState() {
  if (process.env.ADMIN_LOCAL_DATA_PATH) {
    try {
      return JSON.parse(await readFile(process.env.ADMIN_LOCAL_DATA_PATH, 'utf8'))
    } catch (error) {
      if (error.code === 'ENOENT') return INITIAL_STATE
      throw error
    }
  }
  const store = getStore('riyad-admin')
  return (await store.get('workspace', { type: 'json' })) || INITIAL_STATE
}

async function writeState(state) {
  if (process.env.ADMIN_LOCAL_DATA_PATH) {
    const path = process.env.ADMIN_LOCAL_DATA_PATH
    await mkdir(dirname(path), { recursive: true })
    const temporaryPath = `${path}.tmp`
    await writeFile(temporaryPath, JSON.stringify(state), 'utf8')
    await rename(temporaryPath, path)
    return
  }
  await getStore('riyad-admin').setJSON('workspace', state)
}

function isText(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength
}

function validState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return false
  if (!Array.isArray(state.transactions) || !Array.isArray(state.tasks) || !Array.isArray(state.notes)) return false
  if (state.transactions.length > 10_000 || state.tasks.length > 10_000 || state.notes.length > 2_000) return false

  const validTransactions = state.transactions.every((item) =>
    item && typeof item.id === 'string' &&
    ['receivable', 'payable', 'collected', 'repaid', 'income', 'expense', 'saving'].includes(item.type) &&
    Number.isFinite(item.amount) && item.amount > 0 && item.amount <= 1_000_000_000 &&
    isText(item.title, 120) && isText(item.person, 120) &&
    isText(item.date, 10) && isText(item.details, 2000))
  const validTasks = state.tasks.every((item) =>
    item && typeof item.id === 'string' && isText(item.title, 160) &&
    isText(item.details, 4000) && isText(item.dueDate, 10) &&
    isText(item.category, 60) && ['low', 'medium', 'high'].includes(item.priority) &&
    typeof item.completed === 'boolean')
  const validNotes = state.notes.every((item) =>
    item && typeof item.id === 'string' && isText(item.title, 120) &&
    isText(item.language, 40) && isText(item.body, 100_000) &&
    isText(item.updatedAt, 40))
  return validTransactions && validTasks && validNotes
}

export default async function handler(request) {
  const { username, password } = credentials()
  const missingCredentials = Object.entries({ ADMIN_USERNAME: username, ADMIN_PASSWORD: password })
    .filter(([, value]) => !value)
    .map(([name]) => name)
  if (missingCredentials.length > 0) {
    console.error(`admin: missing environment variables: ${missingCredentials.join(', ')}`)
    return json(503, { error: `Admin access is not configured on the server. Missing: ${missingCredentials.join(', ')}.` })
  }

  if (request.method === 'POST') {
    let body
    try {
      body = await request.json()
    } catch {
      return json(400, { error: 'Invalid request body.' })
    }

    if (body.action === 'login') {
      const valid = typeof body.username === 'string' && typeof body.password === 'string' &&
        equalSecret(body.username, username) && equalSecret(body.password, password)
      if (!valid) return json(401, { error: 'Those credentials did not match.' })
      const expiresAt = String(Date.now() + SESSION_DURATION)
      const cookie = sessionCookie(request, `${expiresAt}.${sessionSignature(expiresAt)}`, SESSION_DURATION / 1000)
      try {
        return json(200, { authenticated: true, state: await readState() }, { 'Set-Cookie': cookie })
      } catch (error) {
        console.error('admin: could not read workspace', error)
        return json(500, { error: 'Could not load the admin workspace.' })
      }
    }

    if (body.action === 'logout') {
      return json(200, { authenticated: false }, { 'Set-Cookie': sessionCookie(request, '', 0) })
    }
  }

  if (!isAuthenticated(request)) return json(401, { error: 'Please sign in to continue.' })

  if (request.method === 'GET') {
    try {
      return json(200, { authenticated: true, state: await readState() })
    } catch (error) {
      console.error('admin: could not read workspace', error)
      return json(500, { error: 'Could not load the admin workspace.' })
    }
  }

  if (request.method === 'PUT') {
    const body = await request.text()
    if (body.length > MAX_BODY_SIZE) return json(413, { error: 'Workspace is too large.' })
    let state
    try {
      state = JSON.parse(body)
    } catch {
      return json(400, { error: 'Invalid request body.' })
    }
    if (!validState(state)) return json(400, { error: 'Workspace data did not pass validation.' })
    try {
      await writeState(state)
      return json(200, { saved: true })
    } catch (error) {
      console.error('admin: could not save workspace', error)
      return json(500, { error: 'Could not save the admin workspace.' })
    }
  }

  return json(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST, PUT' })
}

export const config = { path: '/api/admin' }