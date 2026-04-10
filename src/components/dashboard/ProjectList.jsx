import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const statusColors = {
  planning: "bg-purple-100 text-purple-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const statusLabels = {
  planning: "Planning",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};

export default function ProjectList({ projects = [], clients = [] }) {
  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.company || client?.name || "Unknown Client";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-lg">📁</span>
          <span>Active Projects</span>
        </h3>

        <Link
          to="/Projects"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No active projects yet
          </div>
        ) : (
          projects.slice(0, 5).map((project) => (
            <Link
              key={project.id}
              to={`/Projects?id=${project.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-800">{project.name}</p>
                <p className="text-sm text-slate-500">
                  {getClientName(project.client_id)}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusColors[project.status] || "bg-slate-100 text-slate-700"
                )}
              >
                {statusLabels[project.status] || project.status || "Unknown"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}