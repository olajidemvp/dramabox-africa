import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Episode } from '../data/catalog'
import { formatLocal, useStore } from '../store'
import { track } from '../lib/analytics'

export function UnlockModal({
  episode,
  seriesId,
  onUnlocked,
  onClose,
}: {
  episode: Episode
  seriesId: string
  onUnlocked: () => void
  onClose: () => void
}) {
  const store = useStore()
  const navigate = useNavigate()
  const canAfford = store.coins >= episode.coinPrice
  const [adMessage, setAdMessage] = useState('')

  useEffect(() => {
    track('paywall_hit', { series: seriesId, ep: episode.number, price: episode.coinPrice })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id])

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div
        className="coin-pop w-full max-w-md rounded-t-2xl bg-surface-2 p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-base font-bold">Unlock {episode.title}</h3>
        <p className="mt-1 text-xs text-white/60">
          Support African storytellers — unlock to keep watching.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-3 p-4">
          <div>
            <p className="text-sm font-semibold">
              🪙 {episode.coinPrice} coins
              <span className="ml-2 text-xs font-normal text-white/50">
                ≈ {formatLocal(episode.coinPrice, store.currency)}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-white/50">Balance: 🪙 {store.coins}</p>
          </div>
        </div>

        {canAfford ? (
          <button
            className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white active:bg-brand-dark"
            onClick={() => {
              track('unlock_click', { series: seriesId, ep: episode.number, price: episode.coinPrice })
              if (store.unlockEpisode(episode.id, episode.coinPrice)) {
                track('unlock_success', { series: seriesId, ep: episode.number, price: episode.coinPrice })
                onUnlocked()
              }
            }}
          >
            Unlock Now
          </button>
        ) : (
          <button
            className="mt-4 w-full rounded-xl bg-gold py-3 text-sm font-bold text-black"
            onClick={() => {
              track('unlock_click', { series: seriesId, ep: episode.number, price: episode.coinPrice, broke: true })
              navigate('/wallet')
            }}
          >
            Not enough coins — Top up with M-Pesa / MoMo
          </button>
        )}

        <button
          className="mt-2 w-full rounded-xl border border-white/15 py-2.5 text-xs font-semibold text-white/80"
          onClick={() => {
            track('ad_unlock_click', { series: seriesId, ep: episode.number })
            setAdMessage('😅 No ads available in your region yet — unlock with coins instead.')
          }}
        >
          🎬 Watch an ad to unlock free
        </button>
        {adMessage && <p className="mt-2 text-center text-[11px] text-gold">{adMessage}</p>}

        <button className="mt-2 w-full py-2 text-xs text-white/50" onClick={onClose}>
          Maybe later
        </button>
      </div>
    </div>
  )
}
