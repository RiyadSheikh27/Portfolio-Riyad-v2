// src/routes/router.jsx
// -----------------------------------------------------------------------------
// Defines every route in the app using React Router v6's recommended
// createBrowserRouter API (data router). Both routes nest under AppLayout so
// Header/Footer stay consistent, and AppLayout renders the matched child via
// <Outlet /> (see components/layout/AppLayout.jsx).
//
//   "/"           -> Portfolio  (the main single-page horizontal layout)
//   "/lets-talk"  -> LetsTalk   (contact form, reachable only via the
//                                 Footer's "Let's talk ↗" link)
// -----------------------------------------------------------------------------
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Portfolio from '../pages/Portfolio'
import LetsTalk from '../pages/LetsTalk'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Portfolio /> },
      { path: '/lets-talk', element: <LetsTalk /> },
    ],
  },
])
