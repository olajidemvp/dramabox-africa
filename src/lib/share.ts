import { deviceId, track } from './analytics'

// Referral-tagged share links; ?ref lets us attribute inbound visits to sharers.
export async function shareSeries(seriesId: string, title: string, source: string): Promise<void> {
  const url = `${location.origin}/series/${seriesId}?ref=${deviceId}`
  track('share_click', { series: seriesId, source })
  const text = `You need to see "${title}" on Wahala 🔥 Short African dramas, first episodes free:`
  try {
    if (navigator.share) {
      await navigator.share({ title: `${title} — Wahala`, text, url })
      return
    }
  } catch {
    /* user cancelled native share — fall through to clipboard */
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    alert('Link copied — send it to your people! 🔗')
  } catch {
    prompt('Copy this link:', url)
  }
}
