import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  perCoin: number // local currency per coin, demo pricing
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', perCoin: 2.5 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', perCoin: 0.22 },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', perCoin: 0.025 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', perCoin: 0.03 },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', perCoin: 4.3 },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', perCoin: 6.2 },
]

interface AppState {
  coins: number
  unlocked: string[]
  myList: string[]
  progress: Record<string, number> // seriesId -> last episode number watched
  currency: string
  dataSaver: boolean
  checkinLast: string
  checkinStreak: number
  votedFor: string
  notified: string[]
  addCoins: (n: number) => void
  unlockEpisode: (epId: string, price: number) => boolean
  isUnlocked: (epId: string) => boolean
  toggleMyList: (seriesId: string) => void
  inMyList: (seriesId: string) => boolean
  setProgress: (seriesId: string, ep: number) => void
  setCurrency: (code: string) => void
  setDataSaver: (on: boolean) => void
  claimCheckin: () => { bonus: number; streak: number } | null
  canCheckin: () => boolean
  voteNext: (optionId: string) => void
  addNotify: (title: string) => void
}

const KEY = 'wahala-state-v1'

interface Persisted {
  coins: number
  unlocked: string[]
  myList: string[]
  progress: Record<string, number>
  currency: string
  dataSaver: boolean
  checkinLast: string // yyyy-mm-dd of last claimed daily reward
  checkinStreak: number
  votedFor: string // vote-next option id, '' = not voted
  notified: string[] // coming-soon ids with notify requested
}

const DEFAULTS: Persisted = {
  coins: 100,
  unlocked: [],
  myList: [],
  progress: {},
  currency: 'NGN',
  dataSaver: false,
  checkinLast: '',
  checkinStreak: 0,
  votedFor: '',
  notified: [],
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* corrupted state falls back to defaults */
  }
  return DEFAULTS
}

const CHECKIN_REWARDS = [20, 25, 30, 35, 40, 50, 100] // day 1..7, repeats

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

const Ctx = createContext<AppState | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const value: AppState = {
    ...state,
    addCoins: (n) => setState((s) => ({ ...s, coins: s.coins + n })),
    unlockEpisode: (epId, price) => {
      if (state.unlocked.includes(epId)) return true
      if (state.coins < price) return false
      setState((s) => ({ ...s, coins: s.coins - price, unlocked: [...s.unlocked, epId] }))
      return true
    },
    isUnlocked: (epId) => state.unlocked.includes(epId),
    toggleMyList: (id) =>
      setState((s) => ({
        ...s,
        myList: s.myList.includes(id) ? s.myList.filter((x) => x !== id) : [...s.myList, id],
      })),
    inMyList: (id) => state.myList.includes(id),
    setProgress: (id, ep) =>
      setState((s) => ({
        ...s,
        progress: { ...s.progress, [id]: Math.max(s.progress[id] ?? 0, ep) },
      })),
    setCurrency: (code) => setState((s) => ({ ...s, currency: code })),
    setDataSaver: (on) => setState((s) => ({ ...s, dataSaver: on })),
    canCheckin: () => state.checkinLast !== todayStr(),
    claimCheckin: () => {
      const today = todayStr()
      if (state.checkinLast === today) return null
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = state.checkinLast === yesterday ? state.checkinStreak + 1 : 1
      const bonus = CHECKIN_REWARDS[(streak - 1) % CHECKIN_REWARDS.length]
      setState((s) => ({ ...s, coins: s.coins + bonus, checkinLast: today, checkinStreak: streak }))
      return { bonus, streak }
    },
    voteNext: (optionId) => setState((s) => ({ ...s, votedFor: optionId })),
    addNotify: (title) =>
      setState((s) => (s.notified.includes(title) ? s : { ...s, notified: [...s.notified, title] })),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}

export function currencyInfo(code: string): CurrencyInfo {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

export function formatLocal(coins: number, code: string): string {
  const c = currencyInfo(code)
  const amount = coins * c.perCoin
  return `${c.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}
