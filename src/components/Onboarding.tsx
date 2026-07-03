import { useState } from 'react'
import { useStore } from '../store'
import { track } from '../lib/analytics'

const COUNTRIES = [
  '🇳🇬 Nigeria', '🇰🇪 Kenya', '🇬🇭 Ghana', '🇿🇦 South Africa',
  '🇺🇬 Uganda', '🇹🇿 Tanzania', '🇪🇬 Egypt', '🇸🇳 Senegal',
  '🇷🇼 Rwanda', '🌍 Elsewhere',
]

const GENRES = [
  '💘 Romance', '⚡ Revenge', '👨‍👩‍👧 Family Drama',
  '😂 Comedy', '🔍 Mystery', '💥 Action',
  '👑 Royalty & Power', '💰 Billionaire',
]

// First-run intent capture. Two taps: measures demand by country + genre
// (desirability signal) and gets a micro-commitment before browsing.
export function Onboarding() {
  const store = useStore()
  const [step, setStep] = useState(0)
  const [country, setCountry] = useState('')
  const [genres, setGenres] = useState<string[]>([])

  if (store.onboarded) return null

  const clean = (s: string) => s.replace(/^[^\p{L}]+/u, '').trim()

  const toggleGenre = (g: string) =>
    setGenres((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]))

  const finish = () => {
    const c = clean(country)
    const gs = genres.map(clean)
    track('onboarding_complete', { country: c, genres: gs })
    store.completeOnboarding(c, gs)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-surface-2 p-6 pb-8 md:rounded-3xl">
        {step === 0 ? (
          <>
            <p className="text-3xl">👋</p>
            <h2 className="mt-2 text-xl font-extrabold">Welcome to Wahala!</h2>
            <p className="mt-1 text-sm text-white/60">
              Short African dramas, made for your phone. Where you dey watch from?
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                    country === c ? 'border-brand bg-brand/15 text-white' : 'border-white/10 bg-surface-3 text-white/70'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              disabled={!country}
              onClick={() => setStep(1)}
              className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold transition enabled:hover:bg-brand-dark disabled:opacity-40"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <p className="text-3xl">🎬</p>
            <h2 className="mt-2 text-xl font-extrabold">What makes you press play?</h2>
            <p className="mt-1 text-sm text-white/60">Pick your vibes — we'll line up your feed.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                    genres.includes(g) ? 'border-gold bg-gold/15 text-gold' : 'border-white/10 bg-surface-3 text-white/70'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              disabled={genres.length === 0}
              onClick={finish}
              className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold transition enabled:hover:bg-brand-dark disabled:opacity-40"
            >
              Start watching ▶
            </button>
            <button onClick={() => setStep(0)} className="mt-2 w-full py-1 text-xs text-white/40">
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
