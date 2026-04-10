import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "../api/projects";
import ProjectCard from "../components/projects/ProjectCard";

const statusFilters = ["All", "Creating", "Active", "Completed"];

const initialFormState = {
  ProjectName: "",
  ProjectDescription: "",
  projectType: "",
  ClientId: "",
  ClientName: "",
  Status: "Creating",
  StartDate: "",
  Deadline: "",
  Budget: "",
  CreatedByEmail: "",
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await createProject(form);
      setShowForm(false);
      setForm(initialFormState);
      await loadProjects();
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project.");
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    const confirmed = window.confirm(`Delete project "${projectName}"?`);
    if (!confirmed) return;

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const name = String(project.name || "").toLowerCase();
    const description = String(project.description || "").toLowerCase();
    const clientName = String(project.clientName || "").toLowerCase();
    const searchValue = search.toLowerCase();

    const matchesSearch =
      name.includes(searchValue) ||
      description.includes(searchValue) ||
      clientName.includes(searchValue);

    const matchesFilter =
      activeFilter === "All" || project.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500">Manage and monitor all projects</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg px-3 py-2 text-sm ${
                activeFilter === filter
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="relative">
              <ProjectCard project={project} />

              <button
                onClick={() => handleDeleteProject(project.id, project.name)}
                className="absolute right-3 top-3 rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                New Project
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={form.ProjectName}
                onChange={(e) =>
                  setForm({ ...form, ProjectName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />

              <textarea
                placeholder="Project Description"
                value={form.ProjectDescription}
                onChange={(e) =>
                  setForm({ ...form, ProjectDescription: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={3}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Project Type"
                  value={form.projectType}
                  onChange={(e) =>
                    setForm({ ...form, projectType: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <input
                  type="text"
                  placeholder="Client Name"
                  value={form.ClientName}
                  onChange={(e) =>
                    setForm({ ...form, ClientName: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <input
                  type="date"
                  value={form.StartDate}
                  onChange={(e) =>
                    setForm({ ...form, StartDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <input
                  type="date"
                  value={form.Deadline}
                  onChange={(e) =>
                    setForm({ ...form, Deadline: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <input
                  type="number"
                  placeholder="Budget"
                  value={form.Budget}
                  onChange={(e) =>
                    setForm({ ...form, Budget: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <select
                  value={form.Status}
                  onChange={(e) =>
                    setForm({ ...form, Status: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="Creating">Creating</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialFormState);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}