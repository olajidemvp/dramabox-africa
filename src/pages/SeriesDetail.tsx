import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSeries } from '../data/catalog'
import { useStore } from '../store'

export function SeriesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const store = useStore()
  const series = id ? getSeries(id) : undefined

  if (!series) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-20">
        <p className="text-sm text-white/60">Series not found.</p>
        <Link to="/" className="rounded-full bg-brand px-5 py-2 text-xs font-bold">Go home</Link>
      </div>
    )
  }

  const lastEp = store.progress[series.id] ?? 0
  const startEp = Math.min(lastEp + (lastEp ? 0 : 1), series.episodeCount) || 1
  const saved = store.inMyList(series.id)

  return (
    <div className="pb-24">
      <div
        className="relative h-64"
        style={{ background: `linear-gradient(150deg, ${series.poster.from}, ${series.poster.to})` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-3 py-1.5 text-sm"
        >
          ←
        </button>
        <div className="absolute inset-0 flex items-center justify-center text-8xl">{series.poster.emoji}</div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0a0d] via-black/60 to-transparent p-4 pt-16">
          <h1 className="text-xl font-extrabold">{series.title}</h1>
          <p className="mt-1 text-xs text-white/70">
            ★ {series.rating} · {series.views} views · {series.episodeCount} episodes
          </p>
          <p className="text-xs text-white/50">
            {series.genre} · {series.country} · {series.language}
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="mt-3 flex flex-wrap gap-1.5">
          {series.tags.map((t) => (
            <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] text-white/60">
              {t}
            </span>
          ))}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/80">{series.synopsis}</p>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/watch/${series.id}/${startEp}`}
            className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-bold active:bg-brand-dark"
          >
            ▶ {lastEp ? `Continue EP ${lastEp}` : 'Play EP 1 Free'}
          </Link>
          <button
            onClick={() => store.toggleMyList(series.id)}
            className={`rounded-xl px-4 text-lg ${saved ? 'bg-gold text-black' : 'bg-surface-2'}`}
            aria-label="Save to my list"
          >
            {saved ? '✓' : '📌'}
          </button>
        </div>

        <h2 className="mt-6 text-sm font-bold">Episodes</h2>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {series.episodes.map((ep) => {
            const unlocked = ep.free || store.isUnlocked(ep.id)
            const watched = ep.number <= lastEp
            return (
              <Link
                key={ep.id}
                to={`/watch/${series.id}/${ep.number}`}
                className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-semibold ${
                  watched ? 'bg-brand/25 text-brand' : 'bg-surface-2 text-white/80'
                }`}
              >
                {ep.number}
                {!unlocked && (
                  <span className="absolute right-1 top-1 text-[9px] text-gold">🔒</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
