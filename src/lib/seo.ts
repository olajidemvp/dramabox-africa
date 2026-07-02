const BASE_URL = 'https://dramabox-eosin.vercel.app'
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
}

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function applyMeta(path: string, custom?: { title: string; desc: string }) {
  const meta = custom ?? ROUTE_META[path] ?? { title: DEFAULT_TITLE, desc: DEFAULT_DESC }
  document.title = meta.title
  setTag('meta[name="description"]', () => {
    const m = document.createElement('meta')
    m.setAttribute('name', 'description')
    return m
  }, 'content', meta.desc)
  setTag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'canonical')
    return l
  }, 'href', `${BASE_URL}${path === '/' ? '/' : path}`)
}

export function seriesMeta(name: string, country: string, genre: string, episodes: number, synopsis: string) {
  return {
    title: `${name} — ${genre} Short Drama from ${country} | Wahala`,
    desc: `Watch ${name}, a ${episodes}-episode ${genre.toLowerCase()} short drama from ${country}. ${synopsis}`.slice(0, 158),
  }
}
