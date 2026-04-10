import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Calendar,
} from "lucide-react";

import KanbanColumn from "../components/tasks/KanbanColumn";
import TaskForm from "../components/tasks/TaskForm";
import {
  fetchTasks,
  createTask,
  updateTask,
} from "../api/tasks";
import { fetchProjects } from "../api/projects";

const statuses = ["todo", "in_progress", "review", "completed"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [tasksData, projectsData] = await Promise.all([
        fetchTasks(),
        fetchProjects(),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error("Failed to load tasks data:", error);
      setTasks([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    const originalTasks = [...tasks];

    setTasks((prev) =>
      prev.map((task) =>
        String(task.id) === String(draggableId)
          ? { ...task, status: newStatus }
          : task
      )
    );

    try {
      await updateTask(draggableId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
      setTasks(originalTasks);
      alert("Failed to move task.");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }

      await loadData();
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const title = String(task.title || "").toLowerCase();
    const description = String(task.description || "").toLowerCase();
    const projectName = String(task.projectName || "").toLowerCase();
    const searchValue = search.toLowerCase();

    return (
      title.includes(searchValue) ||
      description.includes(searchValue) ||
      projectName.includes(searchValue)
    );
  });

  const getTasksByStatus = (status) =>
    filteredTasks.filter((task) => task.status === status);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Task Management
          </h1>
          <p className="text-slate-500">
            Organize and track your work
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg border py-2 pl-10 pr-3"
          />
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span>Total: {stats.total}</span>
          <span>To Do: {stats.todo}</span>
          <span>In Progress: {stats.inProgress}</span>
          <span>Review: {stats.review}</span>
          <span>Completed: {stats.completed}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("kanban")}
          className={`rounded border px-3 py-1 ${
            viewMode === "kanban" ? "bg-slate-100" : ""
          }`}
        >
          <LayoutGrid className="mr-1 inline h-4 w-4" />
          Kanban
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`rounded border px-3 py-1 ${
            viewMode === "list" ? "bg-slate-100" : ""
          }`}
        >
          <List className="mr-1 inline h-4 w-4" />
          List
        </button>

        <button
          onClick={() => setViewMode("timeline")}
          className={`rounded border px-3 py-1 ${
            viewMode === "timeline" ? "bg-slate-100" : ""
          }`}
        >
          <Calendar className="mr-1 inline h-4 w-4" />
          Timeline
        </button>
      </div>

      {viewMode === "kanban" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onTaskClick={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {viewMode === "list" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {filteredTasks.length === 0 ? (
            <div className="text-slate-500">No tasks found.</div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                  className="cursor-pointer rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-800">{task.title}</div>
                  <div className="text-sm text-slate-500">
                    {task.projectName || "No Project"} • {task.status}
                  </div>
                  {task.description && (
                    <div className="mt-1 text-sm text-slate-600">
                      {task.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === "timeline" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-500">
          Timeline view can be added next.
        </div>
      )}

      <TaskForm
        task={editingTask}
        projects={projects}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}