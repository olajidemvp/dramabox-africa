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
  addCoins: (n: number) => void
  unlockEpisode: (epId: string, price: number) => boolean
  isUnlocked: (epId: string) => boolean
  toggleMyList: (seriesId: string) => void
  inMyList: (seriesId: string) => boolean
  setProgress: (seriesId: string, ep: number) => void
  setCurrency: (code: string) => void
  setDataSaver: (on: boolean) => void
}

const KEY = 'dramabox-africa-state-v1'

interface Persisted {
  coins: number
  unlocked: string[]
  myList: string[]
  progress: Record<string, number>
  currency: string
  dataSaver: boolean
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* corrupted state falls back to defaults */
  }
  return { coins: 100, unlocked: [], myList: [], progress: {}, currency: 'NGN', dataSaver: false }
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
