import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store'
import { BottomNav } from './components/BottomNav'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { MyList } from './pages/MyList'
import { SeriesDetail } from './pages/SeriesDetail'
import { Player } from './pages/Player'
import { Wallet } from './pages/Wallet'
import { Profile } from './pages/Profile'

function Shell() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/watch/')

  return (
    <div className="mx-auto h-full max-w-md bg-[#0a0a0d] shadow-2xl">
      <div className="h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/mylist" element={<MyList />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/watch/:id/:ep" element={<Player />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      {!isPlayer && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  )
}
