import type { Series } from '../data/catalog'

export function Poster({ series, className = '' }: { series: Series; className?: string }) {
  const { from, to, emoji } = series.poster
  return (
    <div
      className={`relative overflow-hidden rounded-xl no-select ${className}`}
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-90 drop-shadow-lg">
        {emoji}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 pt-8">
        <p className="text-[11px] font-bold leading-tight line-clamp-2">{series.title}</p>
        <p className="text-[9px] text-white/60">{series.country} · {series.episodeCount} EP</p>
      </div>
      <div className="absolute left-1.5 top-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-semibold text-gold">
        ★ {series.rating}
      </div>
    </div>
  )
}
