import { Link } from 'react-router-dom'
import { getSeries } from '../data/catalog'
import { currencyInfo, useStore } from '../store'

export function Profile() {
  const store = useStore()
  const cur = currencyInfo(store.currency)
  const watching = Object.keys(store.progress).length
  const unlockedCount = store.unlocked.length

  return (
    <div className="pb-24">
      <header className="px-4 pt-4">
        <h1 className="text-lg font-extrabold">Me</h1>
      </header>

      <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-surface-2 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-2xl">
          🎭
        </div>
        <div>
          <p className="text-sm font-bold">Guest Viewer</p>
          <p className="text-xs text-white/50">Sign-in coming soon · watching from {cur.code} region</p>
        </div>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Coins', value: `🪙 ${store.coins}` },
          { label: 'Watching', value: watching },
          { label: 'Unlocked EPs', value: unlockedCount },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-surface-2 p-3">
            <p className="text-sm font-bold">{s.value}</p>
            <p className="mt-0.5 text-[10px] text-white/50">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mx-4 mt-5 rounded-2xl bg-surface-2">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">📶 Data Saver</p>
            <p className="text-[10px] text-white/50">Lower quality video, less bundle burn</p>
          </div>
          <button
            onClick={() => store.setDataSaver(!store.dataSaver)}
            className={`h-6 w-11 rounded-full p-0.5 transition ${store.dataSaver ? 'bg-brand' : 'bg-white/20'}`}
            aria-label="Toggle data saver"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition ${store.dataSaver ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>
        <div className="border-t border-white/5 p-4">
          <p className="text-sm font-semibold">🌍 Region / Currency</p>
          <p className="mt-0.5 text-[10px] text-white/50">{cur.name} ({cur.code}) — change in Wallet</p>
        </div>
        <Link to="/wallet" className="block border-t border-white/5 p-4 text-sm font-semibold">
          🪙 Top up coins →
        </Link>
        <Link to="/creators" className="block border-t border-white/5 p-4 text-sm font-semibold">
          🎬 I make dramas — submit my series →
        </Link>
      </section>

      {watching > 0 && (
        <section className="mx-4 mt-5">
          <h2 className="text-sm font-bold">Watch history</h2>
          <div className="mt-2 space-y-2">
            {Object.entries(store.progress).map(([sid, ep]) => {
              const s = getSeries(sid)
              if (!s) return null
              return (
                <Link key={sid} to={`/watch/${sid}/${ep}`} className="flex items-center gap-3 rounded-xl bg-surface-2 p-2.5">
                  <div
                    className="flex h-12 w-9 items-center justify-center rounded-lg text-lg"
                    style={{ background: `linear-gradient(160deg, ${s.poster.from}, ${s.poster.to})` }}
                  >
                    {s.poster.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{s.title}</p>
                    <p className="text-[10px] text-white/50">Reached EP {ep} of {s.episodeCount}</p>
                  </div>
                  <span className="text-white/30">›</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <p className="mt-8 text-center text-[10px] text-white/30">
        Wahala · early access · v0.2
      </p>
    </div>
  )
}
