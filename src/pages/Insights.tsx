import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { readInsights } from '../lib/analytics'

interface EventRow { event: string; n: number; devices: number }
interface VariantRow { variant: string; paywall_hits: number; unlocks: number; pay_clicks: number; leads: number }
interface NamedRow { [k: string]: string | number }

interface Insights {
  generated_at: string
  total_events: number
  unique_devices: number
  returning_devices: number
  by_event: EventRow[]
  variant_funnel: VariantRow[]
  countries: NamedRow[]
  genres: NamedRow[]
  votes: NamedRow[]
  notifies: NamedRow[]
  daily: { day: string; devices: number }[]
  leads_total: number
  founding_total: number
  creator_total: number
}

const VARIANT_PRICE: Record<string, string> = { A: '30 coins', B: '50 coins', C: '80 coins' }

function pct(a: number, b: number): string {
  if (!b) return '—'
  return `${Math.round((a / b) * 100)}%`
}

function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-gradient-to-br from-brand to-[#a3170c]' : 'bg-surface-2'}`}>
      <p className={`text-2xl font-extrabold ${accent ? 'text-white' : ''}`}>{value}</p>
      <p className={`mt-0.5 text-[11px] ${accent ? 'text-white/80' : 'text-white/50'}`}>{label}</p>
      {sub && <p className={`mt-1 text-[10px] ${accent ? 'text-white/70' : 'text-white/40'}`}>{sub}</p>}
    </div>
  )
}

export function Insights() {
  const [data, setData] = useState<Insights | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    readInsights()
      .then((d) => {
        setData(d as unknown as Insights)
        setError('')
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const ev = (name: string) => data?.by_event.find((e) => e.event === name)?.n ?? 0
  const evDevices = (name: string) => data?.by_event.find((e) => e.event === name)?.devices ?? 0

  const maxDaily = Math.max(1, ...(data?.daily.map((d) => d.devices) ?? [1]))

  return (
    <div className="mx-auto min-h-full w-full max-w-4xl bg-[#0a0a0d] px-4 py-6 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="text-xs text-white/40">← Wahala</Link>
          <h1 className="text-xl font-extrabold md:text-2xl">📊 Founder Insights</h1>
          <p className="text-[11px] text-white/40">
            Live validation data — do people want this, and will they pay?
          </p>
        </div>
        <button onClick={load} className="rounded-full bg-surface-2 px-4 py-2 text-xs font-bold transition hover:bg-surface-3">
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="mt-10 text-center text-sm text-white/40">Loading…</p>}
      {error && <p className="mt-10 text-center text-sm text-brand">Couldn't load: {error}</p>}

      {data && (
        <>
          {/* Reach */}
          <h2 className="mt-6 text-sm font-bold text-white/70">Reach</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Unique visitors" value={data.unique_devices} />
            <Stat label="Came back another day" value={data.returning_devices} sub={`${pct(data.returning_devices, data.unique_devices)} retention`} />
            <Stat label="Episodes started" value={ev('episode_start')} sub={`${evDevices('episode_start')} viewers`} />
            <Stat label="Episodes finished" value={ev('episode_complete')} />
          </div>

          {/* Willingness to pay */}
          <h2 className="mt-6 text-sm font-bold text-white/70">💰 Will they pay?</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Hit the paywall" value={ev('paywall_hit')} sub={`${evDevices('paywall_hit')} people`} />
            <Stat label="Clicked to pay" value={ev('pay_click')} accent />
            <Stat label="💳 Payment leads" value={data.leads_total} accent sub="gave contact at checkout" />
            <Stat label="🌟 Founding reserves" value={data.founding_total} accent sub="pre-launch commitments" />
          </div>
          <p className="mt-2 rounded-xl bg-surface-2 p-3 text-xs text-white/60">
            Paywall → pay-click conversion:{' '}
            <span className="font-bold text-gold">{pct(ev('pay_click'), ev('paywall_hit'))}</span>
            {' · '}Total buy-intent signals (leads + founding):{' '}
            <span className="font-bold text-gold">{data.leads_total + data.founding_total}</span>
          </p>

          {/* Price test */}
          <h2 className="mt-6 text-sm font-bold text-white/70">🧪 Price test — which price converts?</h2>
          <div className="mt-2 overflow-hidden rounded-2xl bg-surface-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-3 text-white/50">
                <tr>
                  <th className="p-2.5">Variant</th>
                  <th className="p-2.5">Paywall</th>
                  <th className="p-2.5">Unlocks</th>
                  <th className="p-2.5">Pay clicks</th>
                  <th className="p-2.5">Leads</th>
                  <th className="p-2.5">Convert</th>
                </tr>
              </thead>
              <tbody>
                {data.variant_funnel.filter((v) => v.variant !== '?').map((v) => (
                  <tr key={v.variant} className="border-t border-white/5">
                    <td className="p-2.5 font-bold">
                      {v.variant} <span className="font-normal text-white/40">{VARIANT_PRICE[v.variant]}</span>
                    </td>
                    <td className="p-2.5">{v.paywall_hits}</td>
                    <td className="p-2.5">{v.unlocks}</td>
                    <td className="p-2.5">{v.pay_clicks}</td>
                    <td className="p-2.5">{v.leads}</td>
                    <td className="p-2.5 font-bold text-gold">{pct(v.pay_clicks + v.leads, v.paywall_hits)}</td>
                  </tr>
                ))}
                {data.variant_funnel.filter((v) => v.variant !== '?').length === 0 && (
                  <tr><td colSpan={6} className="p-3 text-center text-white/40">No paywall data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Demand by segment */}
          <h2 className="mt-6 text-sm font-bold text-white/70">🌍 Who wants it (from onboarding)</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-surface-2 p-4">
              <p className="mb-2 text-xs font-bold text-white/60">Top countries</p>
              {data.countries.length === 0 && <p className="text-xs text-white/40">No onboarding data yet</p>}
              {data.countries.map((c) => (
                <BarRow key={String(c.country)} label={String(c.country)} n={Number(c.n)} max={Number(data.countries[0]?.n) || 1} />
              ))}
            </div>
            <div className="rounded-2xl bg-surface-2 p-4">
              <p className="mb-2 text-xs font-bold text-white/60">Most-wanted genres</p>
              {data.genres.length === 0 && <p className="text-xs text-white/40">No onboarding data yet</p>}
              {data.genres.map((g) => (
                <BarRow key={String(g.genre)} label={String(g.genre)} n={Number(g.n)} max={Number(data.genres[0]?.n) || 1} gold />
              ))}
            </div>
          </div>

          {/* Content demand */}
          <h2 className="mt-6 text-sm font-bold text-white/70">🎬 Content demand</h2>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <Stat label="Notify-me clicks" value={ev('notify_click')} />
            <Stat label="Next-series votes" value={ev('vote')} />
            <Stat label="Creator submissions" value={data.creator_total} />
          </div>
          {data.votes.length > 0 && (
            <div className="mt-3 rounded-2xl bg-surface-2 p-4">
              <p className="mb-2 text-xs font-bold text-white/60">What people voted to see next</p>
              {data.votes.map((v) => (
                <BarRow key={String(v.option)} label={String(v.option)} n={Number(v.n)} max={Number(data.votes[0]?.n) || 1} />
              ))}
            </div>
          )}

          {/* Daily actives */}
          {data.daily.length > 0 && (
            <>
              <h2 className="mt-6 text-sm font-bold text-white/70">📈 Daily visitors</h2>
              <div className="mt-2 flex items-end gap-1.5 rounded-2xl bg-surface-2 p-4" style={{ height: 120 }}>
                {data.daily.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.day}: ${d.devices}`}>
                    <div className="w-full rounded-t bg-brand" style={{ height: `${(d.devices / maxDaily) * 70}px` }} />
                    <span className="text-[8px] text-white/30">{d.day.slice(5)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="mt-6 text-center text-[10px] text-white/30">
            Aggregate data only · generated {new Date(data.generated_at).toLocaleString()}
          </p>
        </>
      )}
    </div>
  )
}

function BarRow({ label, n, max, gold }: { label: string; n: number; max: number; gold?: boolean }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="w-28 shrink-0 truncate text-[11px] text-white/70">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-3">
        <div className={`h-full rounded-full ${gold ? 'bg-gold' : 'bg-brand'}`} style={{ width: `${(n / max) * 100}%` }} />
      </div>
      <span className="w-6 text-right text-[11px] font-bold">{n}</span>
    </div>
  )
}
