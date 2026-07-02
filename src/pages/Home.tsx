import { Link } from 'react-router-dom'
import { RAILS, SERIES, getSeries } from '../data/catalog'
import { Rail } from '../components/Rail'
import { useStore } from '../store'

export function Home() {
  const store = useStore()
  const hero = SERIES.find((s) => s.id === 'accra-throne')!
  const continueWatching = Object.entries(store.progress)
    .map(([id, ep]) => ({ series: getSeries(id), ep }))
    .filter((x) => x.series)

  return (
    <div className="pb-20">
      <header className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-extrabold tracking-tight">
          Drama<span className="text-brand">Box</span>{' '}
          <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-bold text-brand">AFRICA</span>
        </h1>
        <Link to="/wallet" className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold">
          🪙 {store.coins}
        </Link>
      </header>

      {/* Hero */}
      <Link to={`/series/${hero.id}`} className="mx-4 mt-4 block overflow-hidden rounded-2xl">
        <div
          className="relative h-52 w-full"
          style={{ background: `linear-gradient(120deg, ${hero.poster.from}, ${hero.poster.to})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-7xl">{hero.poster.emoji}</div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gold">#1 in Africa this week</p>
            <h2 className="text-xl font-extrabold">{hero.title}</h2>
            <p className="mt-0.5 text-xs text-white/70">{hero.tagline}</p>
            <span className="mt-2 inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-bold">▶ Watch Free</span>
          </div>
        </div>
      </Link>

      {continueWatching.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 px-4 text-sm font-bold">▶ Continue Watching</h2>
          <div className="flex gap-3 overflow-x-auto px-4">
            {continueWatching.map(({ series, ep }) => (
              <Link
                key={series!.id}
                to={`/watch/${series!.id}/${ep}`}
                className="flex w-56 shrink-0 items-center gap-3 rounded-xl bg-surface-2 p-2"
              >
                <div
                  className="flex h-14 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                  style={{ background: `linear-gradient(160deg, ${series!.poster.from}, ${series!.poster.to})` }}
                >
                  {series!.poster.emoji}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{series!.title}</p>
                  <p className="text-[10px] text-white/50">EP {ep} of {series!.episodeCount}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {RAILS.map((rail) => (
        <Rail
          key={rail.title}
          title={rail.title}
          items={rail.ids.map((id) => getSeries(id)!).filter(Boolean)}
        />
      ))}
    </div>
  )
}
