// netlify/functions/contact.mjs
// -----------------------------------------------------------------------------
// Serverless endpoint behind the /lets-talk contact form. The browser POSTs
// { name, contact, subject, message } as JSON — `contact` is the visitor's
// email OR phone number, only so you know who wrote and how to reply. This
// function validates it and emails it through Gmail SMTP: always FROM the
// site's own GMAIL_USER, TO CONTACT_TO.
//
// Why a function instead of sending from the browser: sending needs the
// Gmail app password, and anything shipped to the browser is readable by
// every visitor. Here the credentials live only in Netlify environment
// variables (Site configuration → Environment variables), never in the repo:
//   GMAIL_USER          — the Gmail account that sends (e.g. a dedicated one)
//   GMAIL_APP_PASSWORD  — a Google "App password" for that account
//   CONTACT_TO          — where messages are delivered
//
// When `contact` is an email address, it's also set as Reply-To, so
// replying in your inbox goes straight back to the visitor. A phone number
// is just included in the message body.
// -----------------------------------------------------------------------------
import nodemailer from 'nodemailer'

// Upper bounds per field, so the endpoint can't be used to send huge mails.
const LIMITS = { name: 100, contact: 200, subject: 150, message: 5000 }

// Deliberately simple checks (mirrored in src/pages/LetsTalk.jsx):
//   email: one "@", no spaces, a dot in the domain
//   phone: digits with optional +, spaces, dashes, dots, parentheses, and
//          7–15 digits in total
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s\-().]+$/

function isEmail(value) {
  return EMAIL_PATTERN.test(value)
}

function isPhone(value) {
  const digits = value.replace(/\D/g, '').length
  return PHONE_PATTERN.test(value) && digits >= 7 && digits <= 15
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Returns an error message for the first invalid field, or null.
function validate(fields) {
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = fields[key]
    if (typeof value !== 'string' || !value.trim()) return `${key} is required.`
    if (value.length > max) return `${key} is too long.`
  }
  const contact = fields.contact.trim()
  if (!isEmail(contact) && !isPhone(contact)) return 'contact must be an email or phone number.'
  return null
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })

  let fields
  try {
    fields = await request.json()
  } catch {
    return json(400, { error: 'Invalid request body.' })
  }

  // Honeypot: a hidden field real visitors never fill in. Bots that fill
  // every input get a fake success, so they don't retry.
  if (fields.website) return json(200, { ok: true })

  const error = validate(fields)
  if (error) return json(400, { error })

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_TO) {
    console.error('contact: missing GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_TO')
    return json(500, { error: 'Email is not configured on the server.' })
  }

  const name = fields.name.trim()
  const contact = fields.contact.trim()
  const subject = fields.subject.trim()
  const message = fields.message.trim()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      from: `"Portfolio contact" <${GMAIL_USER}>`,
      to: CONTACT_TO,
      // Reply-To only when they left an email (a phone can't be replied to).
      ...(isEmail(contact) && { replyTo: `"${name.replace(/"/g, '')}" <${contact}>` }),
      subject: `[Portfolio] ${subject}`,
      // Plain text only — no HTML, so nothing the visitor typed can inject
      // markup into the email.
      text: `Name: ${name}\nContact: ${contact}\nSubject: ${subject}\n\n${message}\n`,
    })
  } catch (sendError) {
    console.error('contact: send failed', sendError)
    return json(502, { error: 'Could not send the message. Please try again later.' })
  }

  return json(200, { ok: true })
}

// Served at /api/contact (instead of the default /.netlify/functions/contact).
export const config = { path: '/api/contact' }
