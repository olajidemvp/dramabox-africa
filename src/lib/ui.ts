// Decoupled trigger for the founding-member modal so any screen can open it
// without prop-drilling. App.tsx listens and renders the modal.
export function openFounding(source: string): void {
  window.dispatchEvent(new CustomEvent('wahala:founding', { detail: { source } }))
}
