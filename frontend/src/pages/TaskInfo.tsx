import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Task } from "../types";
import Nav from "../components/Nav";
import { showError } from "../error";
import TaskEditorModal, { TaskEditorModalHandle } from "../components/TaskEditorModal";
import { TaskDraft } from "../components/TaskEditor";
import TaskInfoView from "../components/TaskInfo";

type KV = { key: string; value: string };

function fromObj(o: any): KV[] {
  return Object.keys(o || {}).map((k) => ({ key: k, value: String(o[k]) }));
}

export default function TaskInfo() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const editorRef = useRef<TaskEditorModalHandle>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data);
      } catch (e: any) {
        showError(e?.response?.data?.message || "Error");
      }
    }
    load();
  }, [id]);

  async function toggleCompleted() {
    try {
      if (!task) return;
      const prevCompleted = task.completed;
      const { data } = await api.patch(`/tasks/${task.id}`, { completed: !prevCompleted });
      setTask(prev => prev ? { ...prev, completed: !prevCompleted, ...(data || {}) } as Task : (data as Task));
    } catch (e: any) {
      showError(e?.response?.data?.message || "Error");
    }
  }

  function openEditor() {
    if (!task) return;
    const draft: TaskDraft = {
      name: task.name,
      description: task.description,
      severity: Math.max(0, Math.min(10, task.severity)),
      fields: fromObj(task.customFields)
    };
    editorRef.current?.open(draft);
  }

  async function saveEditor(draft: TaskDraft) {
    try {
      if (!task) return;
      const custom: any = {};
      draft.fields.forEach(f => { if (f.key) custom[f.key] = f.value });
      const { data } = await api.patch(`/tasks/${task.id}`, {
        name: draft.name,
        description: draft.description,
        severity: draft.severity,
        customFields: custom
      });
      setTask(prev => prev ? { ...prev, ...(data || {}) } as Task : (data as Task));
      editorRef.current?.close();
    } catch (e: any) {
      showError(e?.response?.data?.message || "Error");
    }
  }

  if (!task) {
    return (
      <>
        <div className="container">
          <div className="card bg-dark border-secondary p-3 text-light">Loading</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <div className="card bg-dark border-secondary p-3 text-white">
          <TaskInfoView
            task={task}
            onToggleCompleted={toggleCompleted}
            onEdit={openEditor}
            showDescription
            showFields
            truncateDescription={false}
            backTo="/"
            backLabel="Back"
          />
        </div>
      </div>
      <TaskEditorModal ref={editorRef} title="Edit Task" onSave={saveEditor} />
    </>
  );
}
