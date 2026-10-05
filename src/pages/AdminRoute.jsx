import { lazy, Suspense } from 'react'

const Admin = lazy(() => import('./Admin'))

export default function AdminRoute() {
  return (
    <Suspense fallback={<main className="grid min-h-dvh place-items-center bg-[#111210] text-sm text-chalk-dim">Opening your workspace…</main>}>
      <Admin />
    </Suspense>
  )
}