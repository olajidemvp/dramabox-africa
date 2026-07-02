// Lightweight event tracking for the Wahala MVP experiment.
// Events flow to an insert-only Supabase table; anon key is safe to ship
// (RLS: insert only, no reads). A local ring buffer aids on-device debugging.

const SUPABASE_URL = 'https://maxqbmrsqkstvntcrroq.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heHFibXJzcWtzdHZudGNycm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTgxNTIsImV4cCI6MjA5NTg5NDE1Mn0.sHijiDsftpr9x2JJ-VC9EtQr7AE0MIvqfmuCTUDPLSI'

function persisted(key: string, gen: () => string): string {
  try {
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const value = gen()
    localStorage.setItem(key, value)
    return value
  } catch {
    return gen()
  }
}

export const deviceId = persisted('wahala-device-id', () =>
  `d_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
)

// Price experiment: each device gets a sticky variant for per-episode coin price.
export type PriceVariant = 'A' | 'B' | 'C'
const VARIANT_PRICES: Record<PriceVariant, number> = { A: 30, B: 50, C: 80 }

export const priceVariant = persisted('wahala-price-variant', () => {
  const roll = Math.random()
  return roll < 1 / 3 ? 'A' : roll < 2 / 3 ? 'B' : 'C'
}) as PriceVariant

export const EP_PRICE = VARIANT_PRICES[priceVariant] ?? 50

const BUFFER_KEY = 'wahala-event-log'

export function track(event: string, props: Record<string, unknown> = {}): void {
  const enriched = { ...props, variant: priceVariant, ep_price: EP_PRICE }

  try {
    const buf: unknown[] = JSON.parse(localStorage.getItem(BUFFER_KEY) ?? '[]')
    buf.push({ t: Date.now(), event, ...enriched })
    localStorage.setItem(BUFFER_KEY, JSON.stringify(buf.slice(-200)))
  } catch {
    /* buffer is best-effort */
  }

  try {
    fetch(`${SUPABASE_URL}/rest/v1/wahala_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ device_id: deviceId, event, props: enriched }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* never let analytics break the app */
  }
}
