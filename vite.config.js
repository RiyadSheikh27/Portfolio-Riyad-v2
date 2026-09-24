import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Dev-only: serve the contact form's /api/contact endpoint from the Vite dev
// server, so the form works under plain `npm run dev` (which otherwise knows
// nothing about Netlify Functions). It runs the exact same handler that
// Netlify deploys (netlify/functions/contact.mjs) and feeds it the Gmail
// settings from your local, git-ignored `.env`. In production Netlify serves
// the real function instead; this plugin never ships to the browser.
function contactApiDevServer() {
  return {
    name: 'contact-api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // Load every variable from .env (the '' prefix means "not just VITE_*")
      // into process.env, where the function reads them. Server-side only.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          // Load through Vite so edits to the function apply without a restart.
          const { default: handler } = await server.ssrLoadModule('/netlify/functions/contact.mjs')

          // Collect the request body, then hand the handler a standard
          // Request — the same shape Netlify gives it.
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
          })

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (error) {
          console.error('contact-api-dev-server:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local contact handler crashed — see the terminal.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDevServer()],
})
