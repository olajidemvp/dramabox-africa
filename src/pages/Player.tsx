import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSeries } from '../data/catalog'
import { UnlockModal } from '../components/UnlockModal'
import { useStore } from '../store'

export function Player() {
  const { id, ep } = useParams()
  const navigate = useNavigate()
  const store = useStore()
  const series = id ? getSeries(id) : undefined
  const epNum = Math.max(1, parseInt(ep ?? '1', 10) || 1)

  const videoRef = useRef<HTMLVideoElement>(null)
  const touchStartY = useRef<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [showUnlock, setShowUnlock] = useState(false)
  const [progressPct, setProgressPct] = useState(0)

  const episode = series?.episodes[epNum - 1]
  const unlocked = !!episode && (episode.free || store.isUnlocked(episode.id))

  useEffect(() => {
    setPaused(false)
    setProgressPct(0)
    setShowUnlock(!!episode && !unlocked)
    if (series && episode && unlocked) store.setProgress(series.id, episode.number)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, epNum, unlocked])

  if (!series || !episode) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/60">Episode not found.</p>
        <Link to="/" className="rounded-full bg-brand px-5 py-2 text-xs font-bold">Go home</Link>
      </div>
    )
  }

  const goTo = (n: number) => {
    if (n >= 1 && n <= series.episodeCount) navigate(`/watch/${series.id}/${n}`, { replace: true })
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v || !unlocked) return
    if (v.paused) {
      v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black no-select"
      onTouchStart={(e) => (touchStartY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (touchStartY.current === null) return
        const dy = e.changedTouches[0].clientY - touchStartY.current
        touchStartY.current = null
        if (dy < -60) goTo(epNum + 1)
        else if (dy > 60) goTo(epNum - 1)
      }}
      onWheel={(e) => {
        if (e.deltaY > 40) goTo(epNum + 1)
        else if (e.deltaY < -40) goTo(epNum - 1)
      }}
    >
      {unlocked ? (
        <video
          ref={videoRef}
          key={episode.id}
          src={episode.videoUrl}
          className="h-full w-full object-contain"
          autoPlay
          playsInline
          preload={store.dataSaver ? 'metadata' : 'auto'}
          onClick={togglePlay}
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            if (v.duration) setProgressPct((v.currentTime / v.duration) * 100)
          }}
          onEnded={() => goTo(epNum + 1)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-8xl blur-none"
          style={{ background: `linear-gradient(160deg, ${series.poster.from}, ${series.poster.to})` }}
        >
          <span className="opacity-40">{series.poster.emoji}</span>
        </div>
      )}

      {paused && unlocked && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center text-6xl text-white/80"
        >
          ▶
        </button>
      )}

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-3 pb-8">
        <button onClick={() => navigate(`/series/${series.id}`)} className="rounded-full bg-black/40 px-3 py-1.5 text-sm">
          ←
        </button>
        <div className="text-center">
          <p className="max-w-52 truncate text-xs font-bold">{series.title}</p>
          <p className="text-[10px] text-white/60">EP {epNum} / {series.episodeCount}</p>
        </div>
        <Link to="/wallet" className="rounded-full bg-black/40 px-2.5 py-1.5 text-xs font-semibold">
          🪙 {store.coins}
        </Link>
      </div>

      {/* Right actions */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-4 text-center">
        <button
          onClick={() => store.toggleMyList(series.id)}
          className="flex flex-col items-center text-[10px] text-white/80"
        >
          <span className="text-2xl">{store.inMyList(series.id) ? '💛' : '🤍'}</span>
          Save
        </button>
        <button onClick={() => goTo(epNum + 1)} className="flex flex-col items-center text-[10px] text-white/80">
          <span className="text-2xl">⏭️</span>
          Next EP
        </button>
      </div>

      {/* Bottom info + progress */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
        <p className="text-sm font-bold">{episode.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/60">{series.tagline}</p>
        <div className="mt-3 h-0.5 w-full rounded bg-white/20">
          <div className="h-full rounded bg-brand" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-2 text-center text-[10px] text-white/40">swipe up for next episode</p>
      </div>

      {showUnlock && (
        <UnlockModal
          episode={episode}
          onUnlocked={() => setShowUnlock(false)}
          onClose={() => navigate(`/series/${series.id}`)}
        />
      )}
    </div>
  )
}
