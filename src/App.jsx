// src/App.jsx
// -----------------------------------------------------------------------------
// Top-level component. It intentionally does almost nothing: it just wraps
// the app in React Router's <RouterProvider>, handing off all route-matching
// and page-rendering decisions to routes/router.jsx. Keeping App.jsx this
// thin makes it easy to see, at a glance, that routing is the app's only
// top-level concern (no global providers/state are needed for this project).
// -----------------------------------------------------------------------------
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.jsx'

function App() {
  return <RouterProvider router={router} />
}

export default App
