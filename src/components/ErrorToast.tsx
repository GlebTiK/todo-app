import { useEffect, useRef, useState } from 'react'
import * as bootstrap from 'bootstrap'

function cap(s: string) {
  const t = String(s ?? '').trim()
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''
}
function formatMessage(input: any) {
  const arr = Array.isArray(input) ? input : [input]
  return arr.flat().map(x => cap(x)).join('\n') || 'Error'
}

export default function ErrorToast() {
  const [msg, setMsg] = useState<string>('')
  const elRef = useRef<HTMLDivElement>(null)
  const toastRef = useRef<any>(null)

  useEffect(() => {
    if (elRef.current) toastRef.current = bootstrap.Toast.getOrCreateInstance(elRef.current, { autohide: true, delay: 4000 })
    function handler(e: any) {
      const raw = e?.detail?.message ?? e?.detail ?? 'Error'
      setMsg(formatMessage(raw))
      toastRef.current?.show()
    }
    window.addEventListener('app-error', handler as any)
    return () => window.removeEventListener('app-error', handler as any)
  }, [])

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div ref={elRef} className="toast text-bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-body d-flex align-items-center">
          <div className="me-3" style={{ whiteSpace: 'pre-line' }}>{msg}</div>
          <button type="button" className="btn-close btn-close-white ms-auto" onClick={() => toastRef.current?.hide()} />
        </div>
      </div>
    </div>
  )
}
