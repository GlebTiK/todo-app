import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  min?: number
  max?: number
  value: number
  onChange: (v: number) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function severityColor(sev: number) {
  const s = clamp(sev, 0, 10)
  const hue = 120 - (120 * s) / 10
  return `hsl(${hue}, 70%, 40%)`
}

export default function RangeSlider({ min = 0, max = 10, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const ratio = (value - min) / (max - min)
  const pct = clamp(ratio, 0, 1) * 100

  const computeFromX = useCallback(
    (clientX: number) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = clamp(clientX - r.left, 0, r.width)
      const v = min + (x / r.width) * (max - min)
      onChange(Math.round(v))
    },
    [min, max, onChange]
  )

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging) return
      computeFromX(e.clientX)
    }
    function onUp() {
      if (!dragging) return
      setDragging(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, computeFromX])

  return (
    <div
      ref={ref}
      className="slider-container"
      onPointerDown={e => {
        setDragging(true)
        computeFromX(e.clientX)
      }}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(clamp(value - 1, min, max))
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(clamp(value + 1, min, max))
        if (e.key === 'Home') onChange(min)
        if (e.key === 'End') onChange(max)
      }}
    >
      <div className="slider-track" />
      <div className="slider-fill" style={{ width: `${pct}%`, backgroundColor: severityColor(value) }} />
    </div>
  )
}
