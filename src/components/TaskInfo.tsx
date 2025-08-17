import { Task } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  task: Task
  onToggleCompleted: () => void
  onEdit?: () => void
  showDescription?: boolean
  showFields?: boolean
  truncateDescription?: boolean
  backTo?: string
  backLabel?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function severityColor(sev: number) {
  const s = clamp(sev, 0, 10)
  const hue = 120 - (120 * s) / 10
  return `hsl(${hue}, 70%, 40%)`
}
function truncate(s: string, n = 100) {
  if (!s) return ''
  return s.length <= n ? s : s.slice(0, n) + '...'
}
function fromObj(o: any) {
  return Object.keys(o || {}).map(k => ({ key: k, value: String(o[k]) }))
}

export default function TaskInfoView({
  task,
  onToggleCompleted,
  onEdit,
  showDescription = true,
  showFields = false,
  truncateDescription = false,
  backTo,
  backLabel = 'Back'
}: Props) {
  return (
    <div>
      {backTo && (
        <div className="mb-3">
          <Link to={backTo} className="btn btn-outline-light btn-sm">&larr; {backLabel}</Link>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-start">
        <div className="w-100">
          <div className="d-flex align-items-center gap-2">
            <h2 className="m-0 text-break" style={{ fontSize: '1.25rem', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</h2>
          </div>
          <span
            className="badge mt-1"
            style={{ backgroundColor: severityColor(task.severity), color: '#fff' }}
          >
            [{clamp(task.severity, 0, 10)}/10]
          </span>
          <div
            className="form-check mt-2"
            onMouseDown={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
          >
            <input
              id={`completed-${task.id}`}
              className="form-check-input"
              type="checkbox"
              checked={task.completed}
              onChange={onToggleCompleted}
            />
            <label className="form-check-label ms-2" htmlFor={`completed-${task.id}`}>
              Completed
            </label>
          </div>
        </div>
        <div className="d-flex gap-2">
          {onEdit && <button className="btn btn-outline-light btn-sm" onClick={onEdit}>✏️</button>}
        </div>
      </div>

      {showDescription && (
        <>
          <div className="mt-3"><b>Description</b></div>
          <div className="mt-1 text-break">{truncateDescription ? truncate(task.description, 100) : task.description}</div>
        </>
      )}

      {showFields && (
        <>
          <div className="mt-3"><b>Custom Fields</b></div>
          <div className="mt-2">
            {fromObj(task.customFields).length === 0 && (
              <div className="text-secondary">No custom fields</div>
            )}
            {fromObj(task.customFields).map((f, i) => (
              <div key={i} className="mb-3">
                <div className="fw-bold text-break">{f.key}</div>
                <div className="text-break">{f.value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
