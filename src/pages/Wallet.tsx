import { useState } from 'react'
import { CURRENCIES, currencyInfo, useStore } from '../store'

const PACKS = [
  { coins: 300, bonus: 0, tag: '' },
  { coins: 700, bonus: 70, tag: 'Popular' },
  { coins: 1500, bonus: 300, tag: 'Best Value' },
  { coins: 4000, bonus: 1200, tag: 'Binge Pack' },
]

const PAY_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: '📱', note: 'Kenya, Tanzania' },
  { id: 'momo', name: 'MTN MoMo', icon: '💛', note: 'Ghana, Uganda, +12' },
  { id: 'airtel', name: 'Airtel Money', icon: '🔴', note: 'East & Central Africa' },
  { id: 'opay', name: 'OPay / Bank Transfer', icon: '🏦', note: 'Nigeria' },
  { id: 'card', name: 'Card', icon: '💳', note: 'Visa / Mastercard / Verve' },
]

export function Wallet() {
  const store = useStore()
  const [selectedPack, setSelectedPack] = useState(1)
  const [method, setMethod] = useState('mpesa')
  const [toast, setToast] = useState('')
  const cur = currencyInfo(store.currency)

  const buy = () => {
    const pack = PACKS[selectedPack]
    store.addCoins(pack.coins + pack.bonus)
    const m = PAY_METHODS.find((p) => p.id === method)!
    setToast(`✅ Demo purchase via ${m.name}: +${pack.coins + pack.bonus} coins`)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="pb-24">
      <header className="px-4 pt-4">
        <h1 className="text-lg font-extrabold">Wallet</h1>
      </header>

      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-brand to-[#a3170c] p-5">
        <p className="text-xs text-white/80">Coin balance</p>
        <p className="mt-1 text-3xl font-extrabold">🪙 {store.coins.toLocaleString()}</p>
        <p className="mt-1 text-xs text-white/70">
          ≈ {cur.symbol}
          {(store.coins * cur.perCoin).toLocaleString(undefined, { maximumFractionDigits: 0 })} {cur.code}
        </p>
      </div>

      <section className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Top up</h2>
          <select
            value={store.currency}
            onChange={(e) => store.setCurrency(e.target.value)}
            className="rounded-lg border border-white/10 bg-surface-2 px-2 py-1 text-xs"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {PACKS.map((p, i) => {
            const price = p.coins * cur.perCoin
            return (
              <button
                key={p.coins}
                onClick={() => setSelectedPack(i)}
                className={`relative rounded-xl border p-3 text-left transition ${
                  selectedPack === i ? 'border-brand bg-brand/10' : 'border-white/10 bg-surface-2'
                }`}
              >
                {p.tag && (
                  <span className="absolute -top-2 right-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-black">
                    {p.tag}
                  </span>
                )}
                <p className="text-sm font-bold">🪙 {p.coins.toLocaleString()}</p>
                {p.bonus > 0 && <p className="text-[10px] text-gold">+{p.bonus} bonus</p>}
                <p className="mt-1 text-xs text-white/60">
                  {cur.symbol}{price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-5 px-4">
        <h2 className="text-sm font-bold">Pay with</h2>
        <div className="mt-2 space-y-2">
          {PAY_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                method === m.id ? 'border-brand bg-brand/10' : 'border-white/10 bg-surface-2'
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{m.name}</span>
                <span className="block text-[10px] text-white/50">{m.note}</span>
              </span>
              <span className={`h-4 w-4 rounded-full border-2 ${method === m.id ? 'border-brand bg-brand' : 'border-white/30'}`} />
            </button>
          ))}
        </div>

        <button onClick={buy} className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold active:bg-brand-dark">
          Buy {PACKS[selectedPack].coins + PACKS[selectedPack].bonus} coins (demo)
        </button>
        <p className="mt-2 text-center text-[10px] text-white/40">
          Demo mode — no real payment. Production: Paystack / Flutterwave / M-Pesa Daraja.
        </p>
      </section>

      {toast && (
        <div className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md rounded-xl bg-surface-3 p-3 text-center text-xs font-semibold coin-pop">
          {toast}
        </div>
      )}
    </div>
  )
}
