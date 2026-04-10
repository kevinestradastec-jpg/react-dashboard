import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProjectCard from "../components/projects/ProjectCard";

const statusFilters = ["All", "Creating", "Active", "Completed"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const mapped = Array.isArray(data)
        ? data.map((project) => ({
            id: project.id || "",
            name: project.project_name || "Untitled Project",
            description: project.project_description || "",
            projectType: project.project_type || "",
            clientId: project.client_id || "",
            clientName: project.client_name || "",
            status: project.status || "",
            startDate: project.start_date || "",
            deadline: project.deadline || "",
            budget: Number(project.budget || 0),
            raw: project,
          }))
        : [];

      setProjects(mapped);
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
      const { error } = await supabase.from("projects").insert([
        {
          project_name: form.ProjectName,
          project_description: form.ProjectDescription,
          project_type: form.projectType,
          client_id: form.ClientId || null,
          client_name: form.ClientName,
          status: form.Status,
          start_date: form.StartDate || null,
          deadline: form.Deadline || null,
          budget: form.Budget ? Number(form.Budget) : 0,
          created_by_email: form.CreatedByEmail || null,
        },
      ]);

      if (error) {
        throw error;
      }

      setShowForm(false);
      setForm({
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
      });

      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    const confirmed = window.confirm(`Delete project "${projectName}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.clientName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || project.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md rounded-lg border border-slate-300 px-3 py-2"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              <h2 className="text-xl font-semibold text-slate-800">New Project</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onClick={() => setShowForm(false)}
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