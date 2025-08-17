import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { showError } from '../error'
import TaskEditor, { TaskDraft } from '../components/TaskEditor'

export default function CreateTask() {
  const nav = useNavigate()
  const [draft, setDraft] = useState<TaskDraft>({ name: '', description: '', severity: 0, fields: [] })

  async function save() {
    try {
      const custom: any = {}
      draft.fields.forEach(f => { if (f.key) custom[f.key] = f.value })
      await api.post('/tasks', { name: draft.name, description: draft.description, severity: draft.severity, customFields: custom })
      nav('/')
    } catch (e: any) {
      showError(e?.response?.data?.message || 'Error')
    }
  }

  return (
    <div>
      <div className="container">
        <h2>New Task</h2>
        <div className="card p-3 bg-dark border-secondary text-white">
          <TaskEditor value={draft} onChange={setDraft} submitLabel="Create" onSubmit={save} />
        </div>
      </div>
    </div>
  )
}
