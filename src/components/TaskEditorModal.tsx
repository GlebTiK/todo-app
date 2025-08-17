import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Modal } from 'bootstrap'
import TaskEditor, { TaskDraft } from './TaskEditor'

export type TaskEditorModalHandle = {
  open: (initial: TaskDraft) => void
  close: () => void
}

type Props = {
  title: string
  onSave: (draft: TaskDraft) => Promise<void> | void
}

export default forwardRef<TaskEditorModalHandle, Props>(function TaskEditorModal({ title, onSave }, ref) {
  const elRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<Modal | null>(null)
  const [draft, setDraft] = useState<TaskDraft>({ name: '', description: '', severity: 0, fields: [] })

  useEffect(() => {
    if (elRef.current) modalRef.current = Modal.getOrCreateInstance(elRef.current)
  }, [])

  useImperativeHandle(ref, () => ({
    open(initial: TaskDraft) {
      setDraft(initial)
      modalRef.current?.show()
    },
    close() {
      modalRef.current?.hide()
    }
  }))

  return (
    <div ref={elRef} className="modal fade" id="taskEditorModal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white border-secondary">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
          </div>
          <div className="modal-body">
            <TaskEditor
              value={draft}
              onChange={setDraft}
              submitLabel="Save"
              onSubmit={async () => { await onSave(draft) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
