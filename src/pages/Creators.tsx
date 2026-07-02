import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { track } from '../lib/analytics'

const GENRES = ['Romance', 'Revenge', 'Family Drama', 'Comedy', 'Mystery', 'Action', 'Other']

const COUNTRIES = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Uganda', 'Tanzania',
  'Egypt', 'Senegal', 'Rwanda', 'Ethiopia', 'Cameroon', 'Other',
]

export function Creators() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    contact: '',
    country: 'Nigeria',
    title: '',
    genre: 'Romance',
    episodes: '',
    link: '',
    pitch: '',
  })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const submit = () => {
    if (!form.name.trim() || form.contact.trim().length < 6 || !form.title.trim()) {
      setError('Name, contact and series title are required.')
      return
    }
    track('creator_submission', { ...form })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 pb-20 text-center">
        <p className="text-5xl">🎬</p>
        <h1 className="mt-4 text-xl font-extrabold">You're in the room now.</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          We got <span className="font-bold text-gold">{form.title}</span>. Our content team
          reviews every submission personally — expect a WhatsApp message from us within a few
          days. Keep shooting. 🔥
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-bold"
        >
          Back to Wahala
        </button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3b0a08] via-[#1a0b2e] to-[#0a0a0d] px-5 pb-8 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-sm"
        >
          ←
        </button>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold">For Creators</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight">
          Your story deserves <span className="text-brand">millions of screens.</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          You've been telling stories the world sleeps on — shot on your phone, cut on your
          laptop, carried by pure talent. Hollywood is not coming to find you.{' '}
          <span className="font-semibold text-white">Good. You don't need them.</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Africa watches short drama on the bus, in the queue, before bed — millions of
          1-minute moments waiting for <em>your</em> characters. Wahala puts African stories
          on African phones and pays the people who make them.
        </p>
      </div>

      {/* Why submit */}
      <div className="mt-5 grid grid-cols-3 gap-2 px-4 text-center">
        {[
          { icon: '💰', label: 'Revenue share on every unlock' },
          { icon: '📱', label: 'Audience across 9+ countries' },
          { icon: '🎥', label: 'You keep your rights' },
        ].map((b) => (
          <div key={b.label} className="rounded-xl bg-surface-2 p-3">
            <p className="text-2xl">{b.icon}</p>
            <p className="mt-1 text-[10px] font-semibold leading-tight text-white/80">{b.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 px-5 text-center text-xs italic text-white/50">
        "The next global hit series won't come from a studio lot. It will come from a phone in
        Lagos, Nairobi or Accra."
      </p>

      {/* Form */}
      <div className="mt-6 px-4">
        <h2 className="text-sm font-bold">Submit your catalogue</h2>
        <p className="mt-1 text-[11px] text-white/50">
          Finished series, pilots, or works in progress — we want to see it all.
        </p>

        <div className="mt-3 space-y-3">
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="Your name / studio name *"
            className="w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          <input
            value={form.contact}
            onChange={set('contact')}
            placeholder="WhatsApp number or email *"
            className="w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          <div className="flex gap-2">
            <select
              value={form.country}
              onChange={set('country')}
              className="flex-1 rounded-xl border border-white/10 bg-surface-2 px-3 py-3 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={form.genre}
              onChange={set('genre')}
              className="flex-1 rounded-xl border border-white/10 bg-surface-2 px-3 py-3 text-sm"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="Series title *"
            className="w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          <input
            value={form.episodes}
            onChange={set('episodes')}
            inputMode="numeric"
            placeholder="Number of episodes (finished or planned)"
            className="w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          <input
            value={form.link}
            onChange={set('link')}
            placeholder="Link to your work (YouTube, TikTok, Drive…)"
            className="w-full rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          <textarea
            value={form.pitch}
            onChange={set('pitch')}
            rows={3}
            placeholder="Pitch it in two sentences. Make us need episode 2."
            className="w-full resize-none rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
          />
          {error && <p className="text-[11px] text-brand">{error}</p>}
          <button
            onClick={submit}
            className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold active:bg-brand-dark"
          >
            🎬 Submit my series
          </button>
          <p className="text-center text-[10px] text-white/40">
            We review every submission. You keep full ownership of your work.
          </p>
        </div>
      </div>
    </div>
  )
}
