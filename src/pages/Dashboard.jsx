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
import { getDashboardStats } from "../api/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    creatingProjects: 0,
    totalBudget: 0,
    upcomingDeadlines: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats({
        totalProjects: data.totalProjects || 0,
        activeProjects: data.activeProjects || 0,
        completedProjects: data.completedProjects || 0,
        creatingProjects: data.creatingProjects || 0,
        totalBudget: data.totalBudget || 0,
        upcomingDeadlines: data.upcomingDeadlines || [],
        recentProjects: data.recentProjects || [],
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        creatingProjects: 0,
        totalBudget: 0,
        upcomingDeadlines: [],
        recentProjects: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const dueTodayProjects = stats.upcomingDeadlines.filter((project) => {
    if (!project.deadline) return false;
    const today = new Date().toISOString().split("T")[0];
    const deadline = String(project.deadline).split("T")[0];
    return deadline === today;
  });

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
          value={`${stats.activeProjects} / ${stats.totalProjects}`}
          subtitle={`${stats.totalProjects} total`}
          icon={FolderKanban}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Creating Projects"
          value={stats.creatingProjects}
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
          value={formatCurrency(stats.totalBudget)}
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
                Recent Projects
              </h2>
              <Link
                to="/Projects"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentProjects.length > 0 ? (
                stats.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {project.project_name || project.name || "Untitled Project"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {project.client_name || project.client_id || "-"}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-700">
                        {mapProjectStatus(project.status)}
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
                  No recent projects found.
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
              {stats.upcomingDeadlines.length > 0 ? (
                stats.upcomingDeadlines.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <div className="font-medium text-slate-800">
                      {project.project_name || project.name || "Untitled Project"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(project.deadline)}
                    </div>
                  </div>
                ))
              ) : (
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
                <span className="font-medium">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Active</span>
                <span className="font-medium">{stats.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">{stats.completedProjects}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-medium">
                  {formatCurrency(stats.totalBudget)}
                </span>
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