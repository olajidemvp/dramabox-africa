import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../store'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Browse' },
  { to: '/mylist', label: 'My List' },
  { to: '/creators', label: 'For Creators' },
]

// Desktop / tablet navigation — ReelShort-style top bar. Hidden on phones.
export function TopNav() {
  const store = useStore()
  return (
    <header className="sticky top-0 z-40 hidden border-b border-white/10 bg-[#0a0a0d]/90 backdrop-blur md:block">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Wahala<span className="text-brand">!</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  isActive ? 'bg-brand/15 text-brand' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/wallet"
            className="rounded-full bg-surface-2 px-4 py-1.5 text-sm font-semibold transition hover:bg-surface-3"
          >
            🪙 {store.coins.toLocaleString()}
          </Link>
          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-base"
            aria-label="Profile"
          >
            🎭
          </Link>
        </div>
      </div>
    </header>
  )
}
