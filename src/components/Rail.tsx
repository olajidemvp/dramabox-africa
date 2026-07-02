import { Link } from 'react-router-dom'
import type { Series } from '../data/catalog'
import { Poster } from './Poster'

export function Rail({ title, items }: { title: string; items: Series[] }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 px-4 text-sm font-bold">{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1">
        {items.map((s) => (
          <Link key={s.id} to={`/series/${s.id}`} className="shrink-0">
            <Poster series={s} className="h-44 w-30" />
          </Link>
        ))}
      </div>
    </section>
  )
}
