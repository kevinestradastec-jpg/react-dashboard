import React from "react";
import { FolderKanban, Clock3 } from "lucide-react";

const statusStyles = {
  planning: "bg-purple-100 text-purple-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  active: "bg-blue-100 text-blue-700",
};

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.replaceAll("_", " ");
}

export default function ProjectCard({ project }) {
  const badgeClass =
    statusStyles[project.status] || "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          <FolderKanban className="w-6 h-6" />
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
        >
          {formatStatus(project.status)}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-800">
          {project.name || project.projectName || "Untitled Project"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {project.client || project.clientId || "No client assigned"}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <Clock3 className="w-4 h-4 text-slate-400" />
        <span>{Number(project.hours_logged || 0).toFixed(1)}h logged</span>
      </div>
    </div>
  );
}