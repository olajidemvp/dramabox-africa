import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { COMING_SOON, RAILS, VOTE_OPTIONS, getSeries } from '../data/catalog'
import { Rail } from '../components/Rail'
import { useStore } from '../store'
import { track } from '../lib/analytics'
import { openFounding } from '../lib/ui'

const HERO_IDS = ['accra-throne', 'lagos-billionaire', 'joburg-vows', 'nairobi-heartbeat']

export function Home() {
  const store = useStore()
  const [checkinToast, setCheckinToast] = useState('')
  const [slide, setSlide] = useState(0)
  const heroes = HERO_IDS.map((id) => getSeries(id)!).filter(Boolean)
  const active = slide % heroes.length

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroes.length), 7000)
    return () => clearInterval(t)
  }, [heroes.length])

  const continueWatching = Object.entries(store.progress)
    .map(([id, ep]) => ({ series: getSeries(id), ep }))
    .filter((x) => x.series)

  const claim = () => {
    const result = store.claimCheckin()
    if (!result) return
    track('checkin_claim', { streak: result.streak, bonus: result.bonus })
    setCheckinToast(`+${result.bonus} coins! Day ${result.streak} streak 🔥`)
    setTimeout(() => setCheckinToast(''), 3000)
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-24 md:px-6 md:pb-12">
      {/* Mobile-only header */}
      <header className="flex items-center justify-between px-4 pt-4 md:hidden">
        <h1 className="text-lg font-extrabold tracking-tight">
          Wahala<span className="text-brand">!</span>{' '}
          <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-bold text-brand">
            SHORT DRAMAS
          </span>
        </h1>
        <Link to="/wallet" className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold">
          🪙 {store.coins}
        </Link>
      </header>

      {/* Daily check-in */}
      {store.canCheckin() && (
        <button
          onClick={claim}
          className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-left transition hover:bg-gold/15 md:mx-0 md:mt-5 md:w-full"
        >
          <span>
            <span className="block text-sm font-bold text-gold">🎁 Daily reward ready</span>
            <span className="block text-[11px] text-white/60">
              Day {store.checkinStreak + 1} — tap to claim free coins
            </span>
          </span>
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-black">Claim</span>
        </button>
      )}

      {/* Cinematic hero carousel */}
      <div className="relative mx-4 mt-4 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 md:mx-0 md:mt-5">
        <div className="relative h-64 w-full md:h-[26rem] lg:h-[30rem]">
          {heroes.map((h, i) => {
            const isActive = i === active
            return (
              <Link
                key={h.id}
                to={`/series/${h.id}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                className={`absolute inset-0 block transition-opacity duration-1000 ${
                  isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                }`}
              >
                {/* Gradient base paints instantly; key art fades over it */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(120deg, ${h.poster.from}, ${h.poster.to})` }}
                />
                <div className="poster-sheen absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:text-9xl">
                  {h.poster.emoji}
                </div>
                {(h.heroImage ?? h.poster.image) && (
                  <img
                    src={h.heroImage ?? h.poster.image}
                    alt=""
                    draggable={false}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    className={`absolute inset-0 h-full w-full object-cover ${isActive ? 'kenburns' : ''}`}
                  />
                )}

                {/* Cinematic grade: scrims, grain, vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-transparent to-transparent md:block" />
                <div className="film-grain absolute inset-0" />
                <div className="hero-vignette absolute inset-0" />

                <div className="absolute inset-x-0 bottom-0 p-4 pb-5 md:max-w-2xl md:p-8 md:pb-9">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold md:text-xs">
                    🔥 #{i + 1} in Africa this week
                  </p>
                  <h2 className="hero-title mt-1 text-2xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                    {h.title}
                  </h2>
                  <p className="hero-title mt-1 text-xs text-white/80 md:mt-2 md:text-base">{h.tagline}</p>
                  <p className="mt-1.5 hidden items-center gap-2 text-xs text-white/60 md:flex">
                    <span className="font-semibold text-gold">★ {h.rating}</span>
                    <span>·</span>
                    <span>{h.genre}</span>
                    <span>·</span>
                    <span>{h.country}</span>
                    <span>·</span>
                    <span>{h.episodeCount} episodes</span>
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-xs font-bold shadow-lg shadow-brand/40 transition hover:bg-brand-dark md:mt-4 md:px-7 md:py-2.5 md:text-sm">
                    ▶ Watch Free
                  </span>
                </div>
              </Link>
            )
          })}

          {/* Arrows */}
          <button
            onClick={() => setSlide((s) => (s - 1 + heroes.length) % heroes.length)}
            className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur transition hover:bg-black/70 md:flex"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={() => setSlide((s) => (s + 1) % heroes.length)}
            className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur transition hover:bg-black/70 md:flex"
            aria-label="Next"
          >
            →
          </button>

          {/* Progress dots — active dot fills in sync with the slide timer */}
          <div className="absolute bottom-2.5 right-3 z-20 flex gap-1.5 md:bottom-4 md:right-4">
            {heroes.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 overflow-hidden rounded-full transition-all ${
                  i === active ? 'w-7 bg-white/30' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              >
                {i === active && <span key={slide} className="dot-fill block h-full bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {continueWatching.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 px-4 text-sm font-bold md:px-0 md:text-base">▶ Continue Watching</h2>
          <div className="flex gap-3 overflow-x-auto px-4 md:px-0">
            {continueWatching.map(({ series, ep }) => (
              <Link
                key={series!.id}
                to={`/watch/${series!.id}/${ep}`}
                className="flex w-56 shrink-0 items-center gap-3 rounded-xl bg-surface-2 p-2 transition hover:bg-surface-3"
              >
                <div
                  className="relative flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xl"
                  style={{ background: `linear-gradient(160deg, ${series!.poster.from}, ${series!.poster.to})` }}
                >
                  {series!.poster.emoji}
                  {series!.poster.image && (
                    <img
                      src={series!.poster.image}
                      alt=""
                      loading="lazy"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{series!.title}</p>
                  <p className="text-[10px] text-white/50">EP {ep} of {series!.episodeCount}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Founding-member CTA — pre-launch commitment capture */}
      {!store.founding && (
        <button
          onClick={() => openFounding('home_banner')}
          className="mx-4 mt-5 flex w-[calc(100%-2rem)] items-center gap-3 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-[#1a0b2e] to-[#3b0a08] p-4 text-left transition hover:brightness-125 md:mx-0 md:w-full"
        >
          <span className="text-3xl">🌟</span>
          <span className="flex-1">
            <span className="block text-sm font-extrabold md:text-base">Become a Founding Viewer</span>
            <span className="block text-[11px] text-white/60">
              Full series drop soon — reserve your spot, get bonus coins + first access →
            </span>
          </span>
        </button>
      )}

      {RAILS.map((rail, i) => (
        <Rail
          key={rail.title}
          title={rail.title}
          ranked={i === 0}
          items={rail.ids.map((id) => getSeries(id)!).filter(Boolean)}
        />
      ))}

      {/* Coming soon — fake door */}
      <section className="mt-8">
        <h2 className="mb-2 px-4 text-sm font-bold md:px-0 md:text-base">🎬 Coming Soon</h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 md:grid md:grid-cols-4 md:gap-4 md:px-0">
          {COMING_SOON.map((c) => {
            const notified = store.notified.includes(c.id)
            return (
              <div key={c.id} className="w-40 shrink-0 overflow-hidden rounded-xl bg-surface-2 transition hover:bg-surface-3 md:w-auto">
                <div
                  className="relative flex h-24 items-center justify-center overflow-hidden text-4xl md:h-32"
                  style={{ background: `linear-gradient(160deg, ${c.poster.from}, ${c.poster.to})` }}
                >
                  <div className="poster-sheen absolute inset-0" />
                  <span className="drop-shadow-lg">{c.poster.emoji}</span>
                  {c.poster.image && (
                    <img
                      src={c.poster.image}
                      alt=""
                      loading="lazy"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-2.5 md:p-3">
                  <p className="text-xs font-bold leading-tight md:text-sm">{c.title}</p>
                  <p className="mt-1 line-clamp-2 text-[10px] text-white/50 md:text-[11px]">{c.hook}</p>
                  <button
                    disabled={notified}
                    onClick={() => {
                      track('notify_click', { title: c.id, country: c.country })
                      store.addNotify(c.id)
                    }}
                    className={`mt-2 w-full rounded-full py-1.5 text-[10px] font-bold transition md:text-xs ${
                      notified ? 'bg-surface-3 text-white/40' : 'bg-brand text-white hover:bg-brand-dark'
                    }`}
                  >
                    {notified ? "✓ We'll notify you" : '🔔 Notify me'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        {/* Vote next — fake door */}
        <section className="mx-4 mt-6 rounded-2xl bg-surface-2 p-4 md:mx-0 md:p-5">
          <h2 className="text-sm font-bold md:text-base">🗳️ What should we make next?</h2>
          <p className="mt-0.5 text-[11px] text-white/50">Your vote decides the next series.</p>
          <div className="mt-3 space-y-2">
            {VOTE_OPTIONS.map((o) => {
              const voted = store.votedFor === o.id
              const hasVoted = store.votedFor !== ''
              return (
                <button
                  key={o.id}
                  disabled={hasVoted}
                  onClick={() => {
                    track('vote', { option: o.id })
                    store.voteNext(o.id)
                  }}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                    voted
                      ? 'border-gold bg-gold/15 text-gold'
                      : hasVoted
                        ? 'border-white/5 bg-surface-3 text-white/40'
                        : 'border-white/10 bg-surface-3 hover:border-white/30'
                  }`}
                >
                  {o.label} {voted && '✓'}
                </button>
              )
            })}
          </div>
          {store.votedFor !== '' && (
            <p className="mt-2 text-center text-[11px] text-gold">Thanks — your vote is in! 🎬</p>
          )}
        </section>

        <div className="md:mt-6 md:flex md:flex-col md:gap-4">
          {/* Creator recruitment */}
          <Link
            to="/creators"
            className="mx-4 mt-6 block rounded-2xl bg-gradient-to-r from-[#3b0a08] to-[#1a0b2e] p-4 transition hover:brightness-125 md:mx-0 md:mt-0 md:p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">For Creators</p>
            <p className="mt-1 text-sm font-extrabold md:text-base">Make vertical dramas? Get paid for them. 🎬</p>
            <p className="mt-0.5 text-[11px] text-white/60">
              Submit your series — revenue share, 9+ countries, you keep your rights →
            </p>
          </Link>

          {/* FAQ — matches FAQPage structured data in index.html */}
          <section className="mx-4 mt-6 rounded-2xl bg-surface-2 p-4 md:mx-0 md:mt-0 md:flex-1 md:p-5">
            <h2 className="text-sm font-bold md:text-base">❓ Questions people ask</h2>
            <div className="mt-3 space-y-3">
              {[
                {
                  q: 'What is Wahala?',
                  a: 'A short drama streaming app made for Africa: 1–2 minute vertical episodes with stories from Nigeria, Kenya, Ghana, South Africa and more.',
                },
                {
                  q: 'Is Wahala free to watch?',
                  a: 'The first episodes of every series are free. Later episodes unlock with coins — and daily check-in rewards give you free coins.',
                },
                {
                  q: 'How do I pay in Nigeria, Kenya or Ghana?',
                  a: 'M-Pesa (Kenya, Tanzania), MTN MoMo (Ghana, Uganda), Airtel Money, OPay and bank transfer (Nigeria), or Visa / Mastercard / Verve cards.',
                },
                {
                  q: 'Does Wahala work on slow internet?',
                  a: 'Yes — episodes are short and light, and Data Saver mode cuts video data use so you can binge on 3G.',
                },
              ].map((f) => (
                <details key={f.q} className="group">
                  <summary className="cursor-pointer text-xs font-semibold text-white/90">{f.q}</summary>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/60">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      {checkinToast && (
        <div className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md rounded-xl bg-surface-3 p-3 text-center text-xs font-semibold coin-pop">
          {checkinToast}
        </div>
      )}
    </div>
  )
}
