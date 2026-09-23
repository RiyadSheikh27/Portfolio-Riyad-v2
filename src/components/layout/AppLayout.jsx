// src/components/layout/AppLayout.jsx
// -----------------------------------------------------------------------------
// Root layout component, rendered by every route in routes/router.jsx.
// Its job is to keep Header and Footer identical across every page while
// letting each route render its own content in between. React Router v6
// gives us <Outlet /> for exactly this — the router substitutes the current
// route's element in place of <Outlet />, so this file never needs to know
// which page it's currently wrapping.
//
// This component takes no props: it's a pure structural shell driven by
// whichever child route React Router decides to render.
// -----------------------------------------------------------------------------
import { Outlet } from 'react-router-dom'
import Header from '../header/Header'
import Footer from '../footer/Footer'

function AppLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-bg text-chalk">
      <Header />
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
