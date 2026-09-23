// src/main.jsx
// -----------------------------------------------------------------------------
// The actual entry point of the app. Vite loads this file first (see
// index.html's <script type="module" src="/src/main.jsx">). Its only job is
// to mount the React tree into the #root div using React 18's createRoot API.
// All routing/layout logic lives in App.jsx and routes/router.jsx instead of
// here, so this file stays a one-time bootstrap and nothing more.
// -----------------------------------------------------------------------------
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
