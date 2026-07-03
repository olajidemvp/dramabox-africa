import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/discover', label: 'Discover', icon: '🧭' },
  { to: '/mylist', label: 'My List', icon: '📌' },
  { to: '/wallet', label: 'Wallet', icon: '🪙' },
  { to: '/profile', label: 'Me', icon: '👤' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/10 bg-surface/95 px-2 py-2 backdrop-blur md:hidden">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium transition ${
              isActive ? 'text-brand' : 'text-white/50'
            }`
          }
        >
          <span className="text-lg leading-none">{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
