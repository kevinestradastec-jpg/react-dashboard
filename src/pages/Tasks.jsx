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
      // 🔥 Replace Base44 with mock data for now
      const mockTasks = [
        { id: "1", title: "Prepare BOQ", status: "todo" },
        { id: "2", title: "Submit PRS", status: "in_progress" },
        { id: "3", title: "Review materials", status: "review" },
        { id: "4", title: "Finalize report", status: "completed" },
      ];

      const mockProjects = [
        { id: 1, name: "Solar Project" },
        { id: 2, name: "Electrical Upgrade" },
      ];

      setTasks(mockTasks);
      setProjects(mockProjects);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const handleSave = (data) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...data } : task
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        { id: Date.now().toString(), ...data },
      ]);
    }

    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Task Management
          </h1>
          <p className="text-slate-500">
            Organize and track your work
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Search + Stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 pr-3 py-2 border rounded-lg w-full"
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

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("kanban")}
          className="px-3 py-1 border rounded"
        >
          <LayoutGrid className="w-4 h-4 inline mr-1" />
          Kanban
        </button>

        <button
          onClick={() => setViewMode("list")}
          className="px-3 py-1 border rounded"
        >
          <List className="w-4 h-4 inline mr-1" />
          List
        </button>

        <button
          onClick={() => setViewMode("timeline")}
          className="px-3 py-1 border rounded"
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Timeline
        </button>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Task Form */}
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