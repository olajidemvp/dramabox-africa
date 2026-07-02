# DramaBox Africa

A DramaBox-style short-drama streaming app built for African audiences. Vertical episodes, coin-based unlocks, and mobile-money top-ups — Nollywood-first, continent-wide catalog.

## Features

- **Home** — hero banner, "Continue Watching", curated rails (Trending in Africa, Love & Wahala, Revenge & Comebacks)
- **Vertical player** — autoplay, tap to pause, swipe up / scroll for next episode, auto-advance on end
- **Coin economy** — first episodes free, later episodes unlock for coins; balance persisted in localStorage
- **Wallet** — coin packs priced in NGN / KES / GHS / ZAR / TZS / UGX with M-Pesa, MTN MoMo, Airtel Money, OPay, and card as payment options (demo mode — no real payments)
- **Discover** — search + genre filters across a 10-series pan-African catalog (Nigeria, Kenya, Ghana, South Africa, Uganda, Egypt, Senegal, Rwanda, Tanzania)
- **My List** — bookmark series
- **Profile** — watch history, stats, Data Saver toggle for low-bandwidth viewing

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router. No backend — all state in localStorage, demo videos served from `public/videos` (CC0 sample clips, ~1 MB each).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Production roadmap

- Real payments: Paystack / Flutterwave / M-Pesa Daraja API
- Backend: auth, catalog CMS, entitlements (Supabase or similar)
- Video: HLS adaptive streaming with a low-bitrate ladder for 3G networks
- Localization: Swahili, Hausa, Yoruba, Amharic, French, Arabic UI
- Android-first PWA / TWA for low-end devices
