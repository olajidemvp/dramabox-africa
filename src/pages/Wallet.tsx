import { useState } from 'react'
import { CURRENCIES, currencyInfo, useStore } from '../store'
import { track } from '../lib/analytics'

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

type CheckoutStep = 'closed' | 'confirm' | 'lead' | 'done'

export function Wallet() {
  const store = useStore()
  const [selectedPack, setSelectedPack] = useState(1)
  const [method, setMethod] = useState('mpesa')
  const [step, setStep] = useState<CheckoutStep>('closed')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const cur = currencyInfo(store.currency)

  const pack = PACKS[selectedPack]
  const price = pack.coins * cur.perCoin
  const priceLabel = `${cur.symbol}${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  const methodInfo = PAY_METHODS.find((p) => p.id === method)!

  const startCheckout = () => {
    track('checkout_open', { pack_coins: pack.coins, method, currency: cur.code, amount_local: price })
    setStep('confirm')
  }

  const payClicked = () => {
    track('pay_click', { pack_coins: pack.coins, method, currency: cur.code, amount_local: price })
    setStep('lead')
  }

  const submitLead = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8) {
      setPhoneError('Enter a valid WhatsApp number (with country code)')
      return
    }
    track('lead_captured', {
      phone: digits,
      pack_coins: pack.coins,
      method,
      currency: cur.code,
      amount_local: price,
    })
    store.addCoins(pack.coins + pack.bonus)
    setStep('done')
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
            const packPrice = p.coins * cur.perCoin
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
                  {cur.symbol}{packPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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

        <button
          onClick={startCheckout}
          className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold active:bg-brand-dark"
        >
          Buy {(pack.coins + pack.bonus).toLocaleString()} coins — {priceLabel}
        </button>
      </section>

      {step !== 'closed' && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
          onClick={() => setStep('closed')}
        >
          <div
            className="coin-pop w-full max-w-md rounded-t-2xl bg-surface-2 p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

            {step === 'confirm' && (
              <>
                <h3 className="text-base font-bold">Confirm purchase</h3>
                <div className="mt-3 space-y-2 rounded-xl bg-surface-3 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Coins</span>
                    <span className="font-semibold">
                      🪙 {pack.coins.toLocaleString()}
                      {pack.bonus > 0 && <span className="text-gold"> +{pack.bonus}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total</span>
                    <span className="font-semibold">{priceLabel} {cur.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Method</span>
                    <span className="font-semibold">{methodInfo.icon} {methodInfo.name}</span>
                  </div>
                </div>
                <button
                  onClick={payClicked}
                  className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold active:bg-brand-dark"
                >
                  Pay {priceLabel} with {methodInfo.name}
                </button>
                <button className="mt-2 w-full py-2 text-xs text-white/50" onClick={() => setStep('closed')}>
                  Cancel
                </button>
              </>
            )}

            {step === 'lead' && (
              <>
                <h3 className="text-base font-bold">🚀 Payments launch soon in your area</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  We're switching on {methodInfo.name} very soon. Drop your WhatsApp number and
                  we'll credit you <span className="font-bold text-gold">DOUBLE coins</span> on
                  your first real top-up — plus your {(pack.coins + pack.bonus).toLocaleString()}{' '}
                  coins now, free, as an early tester.
                </p>
                <input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setPhoneError('')
                  }}
                  inputMode="tel"
                  placeholder="WhatsApp number e.g. +234 801 234 5678"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-surface-3 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-brand/60"
                />
                {phoneError && <p className="mt-1 text-[11px] text-brand">{phoneError}</p>}
                <button
                  onClick={submitLead}
                  className="mt-3 w-full rounded-xl bg-gold py-3 text-sm font-bold text-black"
                >
                  Claim my free coins
                </button>
                <button
                  className="mt-2 w-full py-2 text-xs text-white/50"
                  onClick={() => {
                    track('lead_skipped', { pack_coins: pack.coins, method })
                    setStep('closed')
                  }}
                >
                  No thanks
                </button>
              </>
            )}

            {step === 'done' && (
              <>
                <p className="text-center text-4xl">🎉</p>
                <h3 className="mt-2 text-center text-base font-bold">You're on the list!</h3>
                <p className="mt-2 text-center text-xs text-white/70">
                  🪙 {(pack.coins + pack.bonus).toLocaleString()} coins added to your balance.
                  We'll WhatsApp you the moment {methodInfo.name} goes live.
                </p>
                <button
                  onClick={() => setStep('closed')}
                  className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold"
                >
                  Keep watching
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
