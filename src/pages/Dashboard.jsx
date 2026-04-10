import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Clock,
  Calendar,
  ArrowRight,
  Wallet,
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import ProjectList from "../components/dashboard/ProjectList";
import { fetchProjects } from "../api/api"; // adjust path if needed

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(
    (project) => String(project.Status || "").toLowerCase() === "active"
  );

  const creatingProjects = projects.filter(
    (project) => String(project.Status || "").toLowerCase() === "creating"
  );

  const today = new Date().toISOString().split("T")[0];

  const dueTodayProjects = projects.filter((project) => {
    if (!project.Deadline) return false;

    const deadline = String(project.Deadline).split("T")[0];
    return deadline === today;
  });

  const totalBudget = projects.reduce((sum, project) => {
    return sum + Number(project.Budget || 0);
  }, 0);

  const mappedProjects = activeProjects.map((project) => ({
    id: project.ProjectId,
    name: project.ProjectName,
    status: mapProjectStatus(project.Status),
    client_id: project.ClientName || project.ClientId || "-",
    deadline: project.Deadline || "",
    budget: project.Budget || 0,
  }));

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">
            Manage your projects and track project status
          </p>
        </div>

        <Link
          to="/Projects"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          View All Projects <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value={`${activeProjects.length} / ${projects.length}`}
          subtitle={`${projects.length} total`}
          icon={FolderKanban}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Creating Projects"
          value={creatingProjects.length}
          subtitle="Still being prepared"
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <StatsCard
          title="Due Today"
          value={dueTodayProjects.length}
          subtitle="Based on deadline"
          icon={Calendar}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatsCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          subtitle="All listed projects"
          icon={Wallet}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Active Projects
              </h2>
              <Link
                to="/Projects"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {mappedProjects.length > 0 ? (
                mappedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {project.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {project.client_id}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-700">
                        {project.status}
                      </div>
                      <div className="text-xs text-slate-500">
                        {project.deadline
                          ? `Due: ${formatDate(project.deadline)}`
                          : "No deadline"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">
                  No active projects found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Upcoming Deadlines
            </h2>

            <div className="space-y-3">
              {projects
                .filter((project) => project.Deadline)
                .sort(
                  (a, b) =>
                    new Date(a.Deadline).getTime() -
                    new Date(b.Deadline).getTime()
                )
                .slice(0, 5)
                .map((project) => (
                  <div
                    key={project.ProjectId}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <div className="font-medium text-slate-800">
                      {project.ProjectName}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(project.Deadline)}
                    </div>
                  </div>
                ))}

              {projects.filter((project) => project.Deadline).length === 0 && (
                <div className="text-sm text-slate-500">
                  No deadlines available.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Budget Snapshot
            </h2>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Total Projects</span>
                <span className="font-medium">{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>With Budget</span>
                <span className="font-medium">
                  {projects.filter((p) => Number(p.Budget || 0) > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-medium">{formatCurrency(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapProjectStatus(status) {
  const s = String(status || "").toLowerCase();

  if (s === "active") return "In Progress";
  if (s === "creating") return "Creating";
  if (s === "completed") return "Completed";
  return status || "Unknown";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}