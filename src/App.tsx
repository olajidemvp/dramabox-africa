import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store'
import { deviceId, track } from './lib/analytics'
import { applyMeta } from './lib/seo'
import { BottomNav } from './components/BottomNav'
import { TopNav } from './components/TopNav'
import { Onboarding } from './components/Onboarding'
import { FoundingModal } from './components/FoundingModal'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { MyList } from './pages/MyList'
import { SeriesDetail } from './pages/SeriesDetail'
import { Player } from './pages/Player'
import { Wallet } from './pages/Wallet'
import { Profile } from './pages/Profile'
import { Creators } from './pages/Creators'
import { Insights } from './pages/Insights'

function Shell() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/watch/')
  const isInsights = location.pathname.startsWith('/insights')
  const [founding, setFounding] = useState<string | null>(null)

  useEffect(() => {
    track('page_view', { path: location.pathname })
    // Series pages set their own richer meta in SeriesDetail.
    if (!location.pathname.startsWith('/series/')) applyMeta(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: Event) => setFounding((e as CustomEvent).detail?.source ?? 'unknown')
    window.addEventListener('wahala:founding', handler)
    return () => window.removeEventListener('wahala:founding', handler)
  }, [])

  const chromeless = isPlayer || isInsights

  return (
    <div className="flex h-full flex-col bg-[#0a0a0d]">
      {!chromeless && <TopNav />}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/mylist" element={<MyList />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/watch/:id/:ep" element={<Player />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
      {!chromeless && <BottomNav />}
      {!isInsights && <Onboarding />}
      {founding && <FoundingModal source={founding} onClose={() => setFounding(null)} />}
    </div>
  )
}

export default function App() {
  useEffect(() => {
    track('app_open', {})
    const ref = new URLSearchParams(location.search).get('ref')
    if (ref && ref !== deviceId) track('referred_visit', { ref })
  }, [])

  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  )
}
