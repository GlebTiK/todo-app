export function showError(message: string) {
  window.dispatchEvent(new CustomEvent('app-error', { detail: { message } }))
}
