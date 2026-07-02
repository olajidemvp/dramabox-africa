import { EP_PRICE } from '../lib/analytics'

export interface Episode {
  id: string
  number: number
  title: string
  videoUrl: string
  durationSec: number
  free: boolean
  coinPrice: number
}

export interface Series {
  id: string
  title: string
  tagline: string
  synopsis: string
  genre: string
  country: string
  language: string
  rating: number
  views: string
  episodeCount: number
  poster: { from: string; to: string; emoji: string }
  tags: string[]
  episodes: Episode[]
}

// Demo playback sources (local CC0 clips, ~1MB each — data-friendly)
const V = '/videos/'
const CLIPS = ['clip1.mp4', 'clip2.mp4', 'clip3.mp4', 'clip4.mp4', 'clip5.mp4', 'clip6.mp4']

function makeEpisodes(seriesId: string, count: number, freeCount: number): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${seriesId}-ep${i + 1}`,
    number: i + 1,
    title: `Episode ${i + 1}`,
    videoUrl: V + CLIPS[i % CLIPS.length],
    durationSec: 60 + ((i * 13) % 60),
    free: i < freeCount,
    coinPrice: EP_PRICE,
  }))
}

export const SERIES: Series[] = [
  {
    id: 'lagos-billionaire',
    title: "The Billionaire's Secret Wife",
    tagline: 'She cleaned his mansion. Now she owns his heart.',
    synopsis:
      'Amara, a housemaid in Banana Island, secretly marries Lagos billionaire Obinna Okafor to save her sick mother. When his family plots to expose her, she must choose between the contract... and true love.',
    genre: 'Romance',
    country: 'Nigeria',
    language: 'English / Pidgin',
    rating: 9.2,
    views: '12.4M',
    episodeCount: 60,
    poster: { from: '#7c2d12', to: '#facc15', emoji: '💍' },
    tags: ['Trending', 'Billionaire', 'Contract Marriage'],
    episodes: makeEpisodes('lagos-billionaire', 60, 8),
  },
  {
    id: 'nairobi-heartbeat',
    title: 'Nairobi Heartbeat',
    tagline: 'A matatu driver. A CEO. One accidental kiss.',
    synopsis:
      'When tech CEO Wanjiru loses her memory in a matatu accident, driver Kamau tells one small lie — that he is her fiancé. In the estates of Nairobi, love grows faster than the truth can catch up.',
    genre: 'Romance',
    country: 'Kenya',
    language: 'Swahili / English',
    rating: 8.9,
    views: '8.1M',
    episodeCount: 48,
    poster: { from: '#14532d', to: '#22d3ee', emoji: '🚌' },
    tags: ['Amnesia', 'Sweet Love'],
    episodes: makeEpisodes('nairobi-heartbeat', 48, 6),
  },
  {
    id: 'accra-throne',
    title: 'Heir of Accra',
    tagline: 'The street boy they mocked is the chief they must bow to.',
    synopsis:
      "Kofi hawks phone cases at Makola Market — until royal elders reveal he is the lost heir to a powerful stool and a business empire. Now everyone who insulted him must kneel. But the throne demands a price.",
    genre: 'Revenge',
    country: 'Ghana',
    language: 'English / Twi',
    rating: 9.5,
    views: '15.7M',
    episodeCount: 72,
    poster: { from: '#78350f', to: '#dc2626', emoji: '👑' },
    tags: ['Hidden Identity', 'Revenge', 'Hot'],
    episodes: makeEpisodes('accra-throne', 72, 10),
  },
  {
    id: 'joburg-vows',
    title: 'Broken Vows in Joburg',
    tagline: 'Her husband. Her sister. Her revenge.',
    synopsis:
      'Thandi built her husband\'s empire from a Soweto spaza shop. When she catches him with her own sister, she fakes her death — and returns as the mysterious investor buying his company piece by piece.',
    genre: 'Revenge',
    country: 'South Africa',
    language: 'English / Zulu',
    rating: 9.1,
    views: '10.9M',
    episodeCount: 56,
    poster: { from: '#312e81', to: '#ec4899', emoji: '🔥' },
    tags: ['Betrayal', 'Comeback'],
    episodes: makeEpisodes('joburg-vows', 56, 6),
  },
  {
    id: 'mama-tinubu-kitchen',
    title: "Mama T's Kitchen Wars",
    tagline: 'Jollof is war. Family is the battlefield.',
    synopsis:
      'When Mama T dies, her secret jollof recipe — and her buka empire — is left to whichever of her three children can run the kitchen for one year. Sabotage, romance, and party jollof follow.',
    genre: 'Family Drama',
    country: 'Nigeria',
    language: 'Pidgin / Yoruba',
    rating: 8.6,
    views: '6.3M',
    episodeCount: 40,
    poster: { from: '#9a3412', to: '#65a30d', emoji: '🍲' },
    tags: ['Comedy', 'Inheritance'],
    episodes: makeEpisodes('mama-tinubu-kitchen', 40, 5),
  },
  {
    id: 'kampala-ceo',
    title: 'My Boss, My Village Husband',
    tagline: 'Arranged at 5 years old. Reunited in the boardroom.',
    synopsis:
      'Aisha flees an arranged village marriage to chase her career in Kampala — only to discover her new billionaire CEO is the same man she was promised to as a child. He remembers. She doesn\'t.',
    genre: 'Romance',
    country: 'Uganda',
    language: 'English / Luganda',
    rating: 8.8,
    views: '5.2M',
    episodeCount: 44,
    poster: { from: '#701a75', to: '#f59e0b', emoji: '💼' },
    tags: ['CEO', 'Arranged Marriage'],
    episodes: makeEpisodes('kampala-ceo', 44, 6),
  },
  {
    id: 'cairo-nights',
    title: 'Daughters of the Nile',
    tagline: 'Three sisters. One inheritance. A city of secrets.',
    synopsis:
      'After their father\'s empire collapses overnight, three Cairo sisters discover he left each of them one clue to a hidden fortune — and a warning: trust no husband, no uncle, no friend.',
    genre: 'Mystery',
    country: 'Egypt',
    language: 'Arabic / English',
    rating: 8.7,
    views: '7.8M',
    episodeCount: 52,
    poster: { from: '#0c4a6e', to: '#eab308', emoji: '🌙' },
    tags: ['Mystery', 'Sisters'],
    episodes: makeEpisodes('cairo-nights', 52, 6),
  },
  {
    id: 'dakar-destiny',
    title: 'Wrestler of Dakar',
    tagline: 'He fights in the arena. She fights for his heart.',
    synopsis:
      'Modou, a laamb wrestler from Pikine, is one victory away from national glory when a match-fixing syndicate threatens his family. Sports journalist Fatou risks everything to expose them — and falls for him.',
    genre: 'Action',
    country: 'Senegal',
    language: 'French / Wolof',
    rating: 8.4,
    views: '3.9M',
    episodeCount: 36,
    poster: { from: '#155e75', to: '#f97316', emoji: '🤼' },
    tags: ['Sports', 'Underdog'],
    episodes: makeEpisodes('dakar-destiny', 36, 5),
  },
  {
    id: 'kigali-code',
    title: 'The Kigali Code',
    tagline: 'She hacked his company. He hired her heart.',
    synopsis:
      'Brilliant coder Keza exposes a security hole in Rwanda\'s biggest fintech — and its stone-cold founder gives her 30 days to fix it or face prison. Working nights in Kigali Heights, enemies become something else.',
    genre: 'Romance',
    country: 'Rwanda',
    language: 'English / Kinyarwanda',
    rating: 8.5,
    views: '2.7M',
    episodeCount: 38,
    poster: { from: '#1e3a8a', to: '#10b981', emoji: '💻' },
    tags: ['Enemies to Lovers', 'Tech'],
    episodes: makeEpisodes('kigali-code', 38, 5),
  },
  {
    id: 'zanzibar-tide',
    title: 'Tides of Zanzibar',
    tagline: 'A fisherman\'s son. A sultan\'s secret. The sea keeps receipts.',
    synopsis:
      'Juma dives for octopus off Stone Town until he pulls up a chest linking his family to a stolen royal fortune. Old families will kill to keep the tide silent. His childhood love is one of them.',
    genre: 'Mystery',
    country: 'Tanzania',
    language: 'Swahili',
    rating: 8.3,
    views: '3.1M',
    episodeCount: 42,
    poster: { from: '#0e7490', to: '#a21caf', emoji: '🌊' },
    tags: ['Secrets', 'Coastal'],
    episodes: makeEpisodes('zanzibar-tide', 42, 5),
  },
]

export const RAILS: { title: string; ids: string[] }[] = [
  {
    title: '🔥 Trending in Africa',
    ids: ['accra-throne', 'lagos-billionaire', 'joburg-vows', 'nairobi-heartbeat'],
  },
  {
    title: '💘 Love & Wahala',
    ids: ['lagos-billionaire', 'kampala-ceo', 'kigali-code', 'nairobi-heartbeat'],
  },
  {
    title: '⚡ Revenge & Comebacks',
    ids: ['joburg-vows', 'accra-throne', 'cairo-nights'],
  },
  {
    title: '🌍 Across the Continent',
    ids: ['dakar-destiny', 'zanzibar-tide', 'cairo-nights', 'mama-tinubu-kitchen', 'kigali-code'],
  },
]

export const GENRES = ['All', 'Romance', 'Revenge', 'Family Drama', 'Mystery', 'Action']

export function getSeries(id: string): Series | undefined {
  return SERIES.find((s) => s.id === id)
}

// Fake-door "coming soon" titles — measure notify clicks per concept/market.
export interface ComingSoon {
  id: string
  title: string
  hook: string
  country: string
  poster: { from: string; to: string; emoji: string }
}

export const COMING_SOON: ComingSoon[] = [
  {
    id: 'queen-of-owambe',
    title: 'Queen of Owambe',
    hook: 'Lagos party planner discovers her biggest client is her runaway father.',
    country: 'Nigeria',
    poster: { from: '#86198f', to: '#f59e0b', emoji: '🎉' },
  },
  {
    id: 'boda-boda-love',
    title: 'Boda Boda Love',
    hook: 'Nairobi rider carries one passenger who changes his life forever.',
    country: 'Kenya',
    poster: { from: '#166534', to: '#fbbf24', emoji: '🏍️' },
  },
  {
    id: 'campus-cruise',
    title: 'Campus Cruise',
    hook: 'Legon fresher juggles two identities: scholarship kid by day, TikTok star by night.',
    country: 'Ghana',
    poster: { from: '#1d4ed8', to: '#f43f5e', emoji: '🎓' },
  },
  {
    id: 'herbalists-daughter',
    title: "The Herbalist's Daughter",
    hook: 'She can cure anything — except the curse on the family that destroyed hers.',
    country: 'Nigeria',
    poster: { from: '#14532d', to: '#84cc16', emoji: '🌿' },
  },
]

// Fake-door vote — measures which concept pulls demand next.
export const VOTE_OPTIONS = [
  { id: 'village-billionaire', label: '💰 Village boy returns a billionaire (Nigeria)' },
  { id: 'campus-triangle', label: '❤️ University love triangle (Ghana)' },
  { id: 'matatu-comedy', label: '😂 Matatu crew comedy (Kenya)' },
  { id: 'palace-drama', label: '👑 Palace co-wives drama (Senegal)' },
]
