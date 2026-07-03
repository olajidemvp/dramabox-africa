import { getSeries } from '../data/catalog'

const BASE_URL = 'https://wahaladrama.vercel.app'
const DEFAULT_TITLE = 'Wahala — Short Drama App for Africa | Watch Free Vertical Series'
const DEFAULT_DESC =
  "Wahala is Africa's short drama app. Binge addictive 1–2 minute vertical episodes from Nigeria, Kenya, Ghana, South Africa and more. First episodes free."

// Per-route titles/descriptions so Google's JS rendering indexes each page distinctly.
const ROUTE_META: Record<string, { title: string; desc: string }> = {
  '/': { title: DEFAULT_TITLE, desc: DEFAULT_DESC },
  '/discover': {
    title: 'Browse Short African Dramas by Genre & Country | Wahala',
    desc: 'Search short dramas from Nigeria, Kenya, Ghana, South Africa, Uganda, Egypt and more. Romance, revenge, family drama, mystery — first episodes free.',
  },
  '/wallet': {
    title: 'Top Up Coins with M-Pesa, MTN MoMo, Airtel Money | Wahala',
    desc: 'Buy Wahala coins in Naira, Shillings, Cedis or Rand. Pay with M-Pesa, MTN MoMo, Airtel Money, OPay or card to unlock short African drama episodes.',
  },
  '/mylist': {
    title: 'My List | Wahala — Short African Dramas',
    desc: 'Your saved short dramas on Wahala.',
  },
  '/profile': {
    title: 'My Profile | Wahala — Short African Dramas',
    desc: 'Your watch history, coins and settings on Wahala.',
  },
  '/creators': {
    title: 'Submit Your Vertical Drama Series | Wahala for Creators',
    desc: 'African filmmaker with a short vertical drama? Submit your catalogue to Wahala — revenue share on every unlock, audience in 9+ countries, you keep your rights.',
  },
}

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

// Resolves any app path to its meta + canonical. Series and watch pages share
// series-specific meta; watch URLs canonicalize to their series page.
function resolve(path: string): { canonical: string; title: string; desc: string } {
  const seriesMatch = path.match(/^\/(?:series|watch)\/([^/]+)/)
  const series = seriesMatch ? getSeries(seriesMatch[1]) : undefined
  if (series) {
    return {
      canonical: `/series/${series.id}`,
      title: `${series.title} — ${series.genre} Short Drama from ${series.country} | Wahala`,
      desc: `Watch ${series.title}, a ${series.episodeCount}-episode ${series.genre.toLowerCase()} short drama from ${series.country}. ${series.synopsis}`.slice(0, 158),
    }
  }
  const meta = ROUTE_META[path] ?? { title: DEFAULT_TITLE, desc: DEFAULT_DESC }
  return { canonical: path, ...meta }
}

export function applyMeta(path: string) {
  const { canonical, title, desc } = resolve(path)
  document.title = title
  setTag('meta[name="description"]', () => {
    const m = document.createElement('meta')
    m.setAttribute('name', 'description')
    return m
  }, 'content', desc)
  setTag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'canonical')
    return l
  }, 'href', `${BASE_URL}${canonical}`)
}
