import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Series } from '../data/catalog'
import { Poster } from './Poster'

export function Rail({
  title,
  items,
  ranked = false,
}: {
  title: string
  items: Series[]
  ranked?: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)

  const nudge = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="group/rail mt-6">
      <div className="mb-2 flex items-center justify-between px-4 md:px-0">
        <h2 className="text-sm font-bold md:text-base">{title}</h2>
        <div className="flex items-center gap-2">
          {/* Desktop scroll arrows */}
          <button
            onClick={() => nudge(-1)}
            className="hidden h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs text-white/60 opacity-0 transition hover:bg-surface-3 hover:text-white group-hover/rail:opacity-100 md:flex"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => nudge(1)}
            className="hidden h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs text-white/60 opacity-0 transition hover:bg-surface-3 hover:text-white group-hover/rail:opacity-100 md:flex"
            aria-label="Scroll right"
          >
            →
          </button>
          <Link to="/discover" className="text-[11px] font-semibold text-white/40 transition hover:text-brand">
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 md:gap-4 md:px-0"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {items.map((s, i) => (
          <Link
            key={s.id}
            to={`/series/${s.id}`}
            className="flex shrink-0 items-end"
            style={{ scrollSnapAlign: 'start' }}
          >
            {ranked && (
              <span className="rank-number -mr-4 mb-1 text-[64px] md:text-[88px]">{i + 1}</span>
            )}
            <Poster series={s} className="h-44 w-30 md:h-56 md:w-38" />
          </Link>
        ))}
      </div>
    </section>
  )
}
