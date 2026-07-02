# Wahala 🔥

Short African dramas, big feelings. Vertical episodes, coin-based unlocks, mobile-money top-ups — Nollywood-first, continent-wide catalog.

**This build is a desirability + willingness-to-pay experiment.** Every meaningful action is instrumented; payments are a fake door that captures qualified leads.

## Experiment instrumentation

All events flow to an insert-only Supabase table (`wahala_events`) with per-device IDs. Key events:

| Signal | Events |
|---|---|
| Desirability | `episode_start`, `episode_complete`, `page_view`, `app_open`, D1/D7 via `device_id` |
| Willingness to pay | `paywall_hit` → `unlock_click` → `unlock_success`, `checkout_open` → `pay_click` → `lead_captured` (WhatsApp number) |
| Price sensitivity | Per-device A/B/C variant: episode costs 30 / 50 / 80 coins; variant attached to every event |
| Content demand | `notify_click` on coming-soon fake doors, `vote` on next-series poll |
| Monetization alternatives | `ad_unlock_click` (watch-ad fake door) |
| Organic pull | `share_click`, `referred_visit` via `?ref=<device>` links |
| Retention mechanics | `checkin_claim` daily streak rewards |

Query results in the Supabase SQL editor, e.g. paywall conversion:

```sql
select props->>'variant' as variant,
       count(*) filter (where event = 'paywall_hit') as paywall_hits,
       count(*) filter (where event = 'unlock_success') as unlocks,
       count(*) filter (where event = 'lead_captured') as leads
from wahala_events group by 1 order by 1;
```

## Features

- **Home** — hero banner, daily check-in streak rewards, Continue Watching, curated rails, coming-soon fake doors, vote-next poll
- **Vertical player** — autoplay, tap to pause, swipe up / scroll for next episode, auto-advance, share button
- **Coin economy** — first episodes free, later episodes unlock for coins (price varies by experiment arm)
- **Wallet** — coin packs priced in NGN / KES / GHS / ZAR / TZS / UGX; fake-door checkout for M-Pesa, MTN MoMo, Airtel Money, OPay, card → WhatsApp lead capture
- **Discover** — search + genre filters across a 10-series pan-African catalog
- **My List / Profile** — bookmarks, watch history, Data Saver toggle

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · Supabase (analytics sink). App state in localStorage; demo videos in `public/videos` (CC0 clips, ~1 MB each).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Production roadmap

- Real payments: Paystack / Flutterwave / M-Pesa Daraja API
- Real content: licensed or original vertical short dramas (the experiment's true bottleneck)
- Backend: auth, catalog CMS, entitlements
- Video: HLS adaptive streaming with a low-bitrate ladder for 3G networks
- Localization: Swahili, Hausa, Yoruba, Amharic, French, Arabic UI
- Android-first PWA / TWA for low-end devices
