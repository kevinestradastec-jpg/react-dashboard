import React from "react";
import { Clock } from "lucide-react";

export default function TimeTracking({ projects = [] }) {
  const totalHours = projects.reduce(
    (sum, project) => sum + (project.hours_logged || 0),
    0
  );

  const weeklyTarget = 40;

  const progressPercent = Math.min(
    (totalHours / weeklyTarget) * 100,
    100
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-full">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span>This Week's Time</span>
        </h3>
      </div>

      <div className="p-4">
        <p className="text-sm text-slate-500 mb-1">Weekly Progress</p>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800">
            {totalHours.toFixed(1)}h
          </span>
          <span className="text-slate-500">/ {weeklyTarget}h</span>
        </div>

        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}