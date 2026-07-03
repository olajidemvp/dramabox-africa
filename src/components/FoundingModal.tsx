import { useState } from 'react'
import { useStore } from '../store'
import { track } from '../lib/analytics'

// Founding-member reservation. The strongest pre-launch signal we can capture:
// a contact + explicit intent to be there at launch. Honest because the full
// series genuinely drop soon — this is a real reservation, not a fake charge.
export function FoundingModal({ source, onClose }: { source: string; onClose: () => void }) {
  const store = useStore()
  const [contact, setContact] = useState('')
  const [tier, setTier] = useState<'free' | 'supporter'>('free')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = () => {
    const c = contact.trim()
    if (c.length < 6) {
      setError('Enter your WhatsApp number or email')
      return
    }
    track('founding_reserve', { contact: c, tier, source, country: store.viewerCountry })
    store.setFounding()
    if (tier === 'supporter') store.addCoins(500)
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div
        className="coin-pop w-full max-w-md rounded-t-3xl bg-surface-2 p-6 pb-8 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center">
            <p className="text-5xl">🌟</p>
            <h2 className="mt-3 text-xl font-extrabold">You're a Founding Viewer!</h2>
            <p className="mt-2 text-sm text-white/70">
              You're locked in. The moment full series drop, you get first access
              {tier === 'supporter' && ' — plus your 500 bonus coins are in your wallet'}.
              We'll reach you on {contact.includes('@') ? 'email' : 'WhatsApp'}. 🔥
            </p>
            <button onClick={onClose} className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold">
              Keep exploring
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20 md:hidden" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold">Founding Viewer</p>
            <h2 className="mt-1 text-xl font-extrabold">Get in before the crowd 🚀</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Full series are dropping soon. Reserve your spot now and be first to watch —
              founding viewers get bonus coins, early access, and a say in what we make next.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setTier('free')}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  tier === 'free' ? 'border-brand bg-brand/10' : 'border-white/10 bg-surface-3'
                }`}
              >
                <span>
                  <span className="block text-sm font-bold">Reserve free spot</span>
                  <span className="block text-[11px] text-white/50">Early access + launch-day free coins</span>
                </span>
                <span className={`h-4 w-4 rounded-full border-2 ${tier === 'free' ? 'border-brand bg-brand' : 'border-white/30'}`} />
              </button>
              <button
                onClick={() => setTier('supporter')}
                className={`relative flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  tier === 'supporter' ? 'border-gold bg-gold/10' : 'border-white/10 bg-surface-3'
                }`}
              >
                <span className="absolute -top-2 right-3 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-black">
                  BEST
                </span>
                <span>
                  <span className="block text-sm font-bold">Founding supporter 🌟</span>
                  <span className="block text-[11px] text-white/50">Everything above + 500 bonus coins now</span>
                </span>
                <span className={`h-4 w-4 rounded-full border-2 ${tier === 'supporter' ? 'border-gold bg-gold' : 'border-white/30'}`} />
              </button>
            </div>

            <input
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                setError('')
              }}
              placeholder="WhatsApp number or email"
              className="mt-3 w-full rounded-xl border border-white/10 bg-surface-3 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
            />
            {error && <p className="mt-1 text-[11px] text-brand">{error}</p>}

            <button onClick={submit} className="mt-3 w-full rounded-xl bg-brand py-3.5 text-sm font-bold transition hover:bg-brand-dark">
              Reserve my founding spot
            </button>
            <button
              onClick={() => {
                track('founding_dismiss', { source })
                onClose()
              }}
              className="mt-2 w-full py-1.5 text-xs text-white/40"
            >
              Not now
            </button>
          </>
        )}
      </div>
    </div>
  )
}
