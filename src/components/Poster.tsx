import type { Series } from '../data/catalog'

export function Poster({ series, className = '' }: { series: Series; className?: string }) {
  const { from, to, emoji, image } = series.poster
  return (
    <div
      className={`group relative overflow-hidden rounded-xl no-select transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-black/60 ${className}`}
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="poster-sheen absolute inset-0" />
      {/* Emoji stays underneath as the instant-paint / offline fallback */}
      <div className="absolute inset-0 flex items-center justify-center text-5xl drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
        {emoji}
      </div>
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          draggable={false}
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {/* Hover play overlay (desktop) */}
      <div className="absolute inset-0 hidden items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg text-white shadow-lg">
          ▶
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-2 pt-8">
        <p className="text-[11px] font-bold leading-tight line-clamp-2">{series.title}</p>
        <p className="text-[9px] text-white/60">{series.country} · {series.episodeCount} EP</p>
      </div>

      <div className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-gold backdrop-blur-sm">
        ★ {series.rating}
      </div>
      <div className="absolute right-1.5 top-1.5 rounded bg-brand/85 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
        {series.genre}
      </div>
    </div>
  )
}
