import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import StatsCard from "../components/dashboard/StatsCard";
import { fetchProjects } from "../api/projects";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"];

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const projectsData = await fetchProjects();

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setTasks([]); // placeholder until Tasks page is migrated
      setInvoices([]); // placeholder until Invoices page is migrated
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      setProjects([]);
      setTasks([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizedProjects = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id || "",
        name: p.name || "Untitled Project",
        status: normalizeProjectStatus(p.status),
        budget: Number(p.budget || 0),
        deadline: p.deadline || "",
        createdAt: p.raw?.created_at || "",
        clientName: p.clientName || "",
      })),
    [projects]
  );

  const normalizedTasks = useMemo(
    () =>
      tasks.map((t) => ({
        status: String(t.status || t.Status || "").toLowerCase(),
        priority: String(t.priority || t.Priority || "").toLowerCase(),
        createdDate: t.created_date || t.CreatedDate || t.createdAt || "",
        updatedDate: t.updated_date || t.UpdatedDate || t.updatedAt || "",
      })),
    [tasks]
  );

  const normalizedInvoices = useMemo(
    () =>
      invoices.map((i) => ({
        status: String(i.status || i.Status || "").toLowerCase(),
        amount: Number(i.amount || i.Amount || 0),
      })),
    [invoices]
  );

  const activeProjects = normalizedProjects.filter(
    (p) => p.status !== "completed"
  ).length;

  const completedTasks = normalizedTasks.filter(
    (t) => t.status === "completed"
  ).length;

  const completionRate =
    normalizedTasks.length > 0
      ? Math.round((completedTasks / normalizedTasks.length) * 100)
      : 0;

  const totalHours = 0;
  const totalRevenue = normalizedInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalBudget = normalizedProjects.reduce(
    (sum, p) => sum + p.budget,
    0
  );

  const projectStatusData = [
    {
      name: "Planning",
      value: normalizedProjects.filter((p) => p.status === "planning").length,
      color: "#8B5CF6",
    },
    {
      name: "In Progress",
      value: normalizedProjects.filter((p) => p.status === "in_progress").length,
      color: "#3B82F6",
    },
    {
      name: "Review",
      value: normalizedProjects.filter((p) => p.status === "review").length,
      color: "#F59E0B",
    },
    {
      name: "Completed",
      value: normalizedProjects.filter((p) => p.status === "completed").length,
      color: "#10B981",
    },
  ].filter((d) => d.value > 0);

  const taskPriorityData = [
    {
      name: "Low",
      value: normalizedTasks.filter((t) => t.priority === "low").length,
      fill: "#10B981",
    },
    {
      name: "Medium",
      value: normalizedTasks.filter((t) => t.priority === "medium").length,
      fill: "#F59E0B",
    },
    {
      name: "High",
      value: normalizedTasks.filter((t) => t.priority === "high").length,
      fill: "#EF4444",
    },
  ];

  const budgetByProjectData = normalizedProjects
    .filter((p) => p.budget > 0)
    .slice(0, 5)
    .map((p) => ({
      name: shortenText(p.name, 14),
      budget: p.budget,
    }));

  const monthlyProjectData = useMemo(() => {
    const months = [];
    const now = new Date();
    const monthCount = getMonthCount(timeRange);

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const createdProjects = normalizedProjects.filter(
        (p) => String(p.createdAt || "").slice(0, 7) === monthStr
      ).length;

      const dueProjects = normalizedProjects.filter(
        (p) => String(p.deadline || "").slice(0, 7) === monthStr
      ).length;

      months.push({
        month: monthName,
        created: createdProjects,
        due: dueProjects,
      });
    }

    return months;
  }, [normalizedProjects, timeRange]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-200" />
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
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500">
            Gain insights into your project performance
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          icon={BarChart3}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={CheckCircle}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Total Hours"
          value={`${totalHours.toFixed(1)}h`}
          icon={Clock}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={DollarSign}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Project Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#3B82F6" name="Created" />
                <Bar dataKey="due" fill="#10B981" name="Due" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Project Status</h3>
          <div className="h-64">
            {projectStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell
                        key={`project-status-cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                No project data yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Budget by Project</h3>
          <div className="flex h-64 items-center justify-center text-slate-500">
            {budgetByProjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetByProjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              "No budget data yet"
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-800">
            Task Priority Distribution
          </h3>
          <div className="h-64">
            {normalizedTasks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskPriorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {taskPriorityData.map((entry, index) => (
                      <Cell
                        key={`priority-cell-${index}`}
                        fill={entry.fill || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                No task data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeProjectStatus(status) {
  const s = String(status || "").toLowerCase().trim();

  if (s === "active") return "in_progress";
  if (s === "creating") return "planning";
  if (s === "completed") return "completed";
  if (s === "review") return "review";
  return "planning";
}

function getMonthCount(range) {
  if (range === "30days") return 1;
  if (range === "3months") return 3;
  if (range === "1year") return 12;
  return 6;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function shortenText(text, maxLength) {
  const value = String(text || "");
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}