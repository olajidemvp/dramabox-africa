import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store'
import { deviceId, track } from './lib/analytics'
import { applyMeta } from './lib/seo'
import { BottomNav } from './components/BottomNav'
import { TopNav } from './components/TopNav'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { MyList } from './pages/MyList'
import { SeriesDetail } from './pages/SeriesDetail'
import { Player } from './pages/Player'
import { Wallet } from './pages/Wallet'
import { Profile } from './pages/Profile'
import { Creators } from './pages/Creators'

function Shell() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/watch/')

  useEffect(() => {
    track('page_view', { path: location.pathname })
    // Series pages set their own richer meta in SeriesDetail.
    if (!location.pathname.startsWith('/series/')) applyMeta(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex h-full flex-col bg-[#0a0a0d]">
      {!isPlayer && <TopNav />}
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
        </Routes>
      </div>
      {!isPlayer && <BottomNav />}
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
