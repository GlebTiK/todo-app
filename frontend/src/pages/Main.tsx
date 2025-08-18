import { useEffect, useMemo, useState } from 'react'
import api from '../api'
import { Task, Paginated } from '../types'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Pagination from '../components/Pagination'
import { Link } from 'react-router-dom'
import { showError } from '../error'
import TaskInfoView from '../components/TaskInfo'

const LIMIT = 10

export default function Main() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Paginated<Task>>({ items: [], total: 0, page: 1, limit: LIMIT })
  const offset = useMemo(() => (page - 1) * LIMIT, [page])

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/tasks', { params: { page, limit: LIMIT } })
        setData(data)
      } catch (e: any) {
        showError(e?.response?.data?.message || 'Error')
      }
    }
    load()
  }, [page])

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const src = result.source.index
    const dst = result.destination.index
    if (src === dst) return
    const items = Array.from(data.items)
    const [removed] = items.splice(src, 1)
    items.splice(dst, 0, removed)
    setData(d => ({ ...d, items }))
    const orderedIds = items.map(t => t.id)
    try {
      await api.patch('/tasks/reorder/list', { orderedIds, offset })
    } catch (e: any) {
      showError(e?.response?.data?.message || 'Error')
    }
  }

  async function toggleComplete(id: number, completed: boolean) {
    try {
      const { data: updated } = await api.patch(`/tasks/${id}`, { completed: !completed })
      setData(d => ({
        ...d,
        items: d.items.map(t => (t.id === id ? { ...t, completed: !completed, ...(updated || {}) } as Task : t))
      }))
    } catch (e: any) {
      showError(e?.response?.data?.message || 'Error')
    }
  }

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="m-0">Your Tasks</h2>
          <Link className="btn btn-primary btn-sm" to="/task/new">New</Link>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {provided => (
              <div className="list" ref={provided.innerRef} {...provided.droppableProps}>
                {data.items.map((t, i) => (
                  <Draggable key={t.id} draggableId={String(t.id)} index={i}>
                    {p => (
                      <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="card bg-dark text-white border-secondary">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="p-2 flex-grow-1">
                            <TaskInfoView
                              task={t}
                              onToggleCompleted={() => toggleComplete(t.id, t.completed)}
                              showDescription
                              showFields={false}
                              truncateDescription
                            />
                          </div>
                          <div className="d-flex align-items-center gap-3 p-2">
                            <Link className="btn btn-outline-light btn-sm" to={`/task/${t.id}`}>Open</Link>
                            <a
                              className="btn btn-outline-danger btn-sm"
                              href="#"
                              onClick={async e => {
                                e.preventDefault()
                                if (!(window as any).confirm('Delete?')) return
                                try {
                                  await api.delete(`/tasks/${t.id}`)
                                  const { data } = await api.get('/tasks', { params: { page, limit: LIMIT } })
                                  setData(data)
                                } catch (e: any) {
                                  showError(e?.response?.data?.message || 'Error')
                                }
                              }}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Pagination page={data.page} total={data.total} limit={data.limit} onPage={setPage} />
      </div>
    </div>
  )
}
