import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GENRES, SERIES } from '../data/catalog'
import { Poster } from '../components/Poster'

export function Discover() {
  const [genre, setGenre] = useState('All')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SERIES.filter((s) => genre === 'All' || s.genre === genre).filter(
      (s) =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [genre, query])

  return (
    <div className="mx-auto w-full max-w-6xl pb-24 md:px-6 md:pb-12">
      <header className="px-4 pt-4 md:px-0 md:pt-6">
        <h1 className="text-lg font-extrabold md:text-2xl">Discover</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, countries, tags…"
          className="mt-3 w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-brand/60 md:max-w-md"
        />
      </header>

      <div className="mt-3 flex gap-2 overflow-x-auto px-4 md:px-0">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              genre === g ? 'bg-brand text-white' : 'bg-surface-2 text-white/60 hover:bg-surface-3 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 px-4 sm:grid-cols-4 md:grid-cols-5 md:gap-4 md:px-0 lg:grid-cols-6">
        {results.map((s, i) => (
          <Link key={s.id} to={`/series/${s.id}`} className="rise-in" style={{ animationDelay: `${i * 30}ms` }}>
            <Poster series={s} className="aspect-[2/3] w-full" />
          </Link>
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-10 text-center text-sm text-white/40">No dramas match — try another search.</p>
      )}
    </div>
  )
}
