import RangeSlider from './RangeSlider'

export type KV = { key: string; value: string }
export type TaskDraft = { name: string; description: string; severity: number; fields: KV[] }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function severityColor(sev: number) {
  const s = clamp(sev, 0, 10)
  const hue = 120 - (120 * s) / 10
  return `hsl(${hue}, 70%, 40%)`
}

type Props = {
  value: TaskDraft
  onChange: (next: TaskDraft) => void
  submitLabel: string
  onSubmit: () => void
}

export default function TaskEditor({ value, onChange, submitLabel, onSubmit }: Props) {
  const canSubmit = value.name.trim().length > 0

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!canSubmit) {
          const el = document.getElementById('task-name') as HTMLTextAreaElement | null
          el?.focus()
          return
        }
        onSubmit()
      }}
    >
      <div className="mb-2">
        <label className="form-label">Name</label>
        <textarea
          id="task-name"
          className="form-control bg-secondary-subtle"
          rows={2}
          required
          aria-required="true"
          value={value.name}
          onChange={e => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea
          className="form-control bg-secondary-subtle"
          rows={5}
          value={value.description}
          onChange={e => onChange({ ...value, description: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Severity (0-10)</label>
        <RangeSlider value={value.severity} onChange={v => onChange({ ...value, severity: v })} />
        <span className="badge mt-3" style={{ backgroundColor: severityColor(value.severity), color: '#fff' }}>
          [{clamp(value.severity, 0, 10)}/10]
        </span>
      </div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <label className="form-label m-0">Custom Fields</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onChange({ ...value, fields: [...value.fields, { key: '', value: '' }] })}
        >
          Add Field
        </button>
      </div>
      {value.fields.map((f, i) => (
        <div key={i} className="mb-2">
          <div className="input-group mb-1">
            <span className="input-group-text bg-secondary-subtle border-dark text-white">Name</span>
            <input
              className="form-control bg-secondary-subtle border-dark text-white"
              placeholder="Custom Field Name"
              value={f.key}
              onChange={e => {
                const copy = value.fields.slice()
                copy[i] = { ...f, key: e.target.value }
                onChange({ ...value, fields: copy })
              }}
            />
          </div>
          <textarea
            className="form-control bg-secondary-subtle border-dark text-white"
            placeholder="Custom Field Value"
            rows={4}
            style={{ resize: 'vertical' }}
            value={f.value}
            onChange={e => {
              const copy = value.fields.slice()
              copy[i] = { ...f, value: e.target.value }
              onChange({ ...value, fields: copy })
            }}
          />
          <div className="mt-1">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onChange({ ...value, fields: value.fields.filter((_, j) => j !== i) })}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" disabled={!canSubmit}>{submitLabel}</button>
    </form>
  )
}
