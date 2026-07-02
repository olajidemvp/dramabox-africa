import { Link } from 'react-router-dom'
import { getSeries } from '../data/catalog'
import { Poster } from '../components/Poster'
import { useStore } from '../store'

export function MyList() {
  const store = useStore()
  const items = store.myList.map((id) => getSeries(id)).filter(Boolean)

  return (
    <div className="pb-20">
      <header className="px-4 pt-4">
        <h1 className="text-lg font-extrabold">My List</h1>
        <p className="mt-1 text-xs text-white/50">Series you saved for later</p>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 px-8 text-center">
          <p className="text-4xl">📌</p>
          <p className="mt-3 text-sm text-white/60">
            Nothing saved yet. Tap the bookmark on any series to add it here.
          </p>
          <Link
            to="/discover"
            className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-xs font-bold"
          >
            Browse dramas
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 px-4">
          {items.map((s) => (
            <Link key={s!.id} to={`/series/${s!.id}`}>
              <Poster series={s!} className="aspect-[2/3] w-full" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
