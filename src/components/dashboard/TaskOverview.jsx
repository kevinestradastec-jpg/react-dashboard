import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function TaskOverview({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const pendingTasks = tasks
    .filter((task) => task.status !== "completed")
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span>Task Overview</span>
        </h3>

        <Link
          to="/Tasks"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            Overall Completion: {completionRate}%
          </span>
          <span className="text-sm font-medium text-slate-800">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="mt-4 space-y-2">
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No pending tasks</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                <span className="text-slate-700 truncate">{task.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}