import React from "react";
import { Clock, GripVertical } from "lucide-react";
import { cn } from "../../lib/utils";

const priorityColors = {
  low: "border-l-emerald-400",
  medium: "border-l-amber-400",
  high: "border-l-red-400",
};

export default function TaskCard({ task, provided, onClick }) {
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg p-4 border border-slate-200 shadow-sm cursor-pointer",
        "hover:shadow-md transition-shadow border-l-4",
        priorityColors[task.priority] || "border-l-slate-300"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-slate-800 text-sm">
          {task.title}
        </h4>
        <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
            task.priority === "high" && "bg-red-100 text-red-700",
            task.priority === "medium" && "bg-amber-100 text-amber-700",
            task.priority === "low" && "bg-emerald-100 text-emerald-700",
            !task.priority && "bg-slate-100 text-slate-600"
          )}
        >
          {task.priority || "none"}
        </span>

        {task.estimated_hours && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {task.estimated_hours}h
          </span>
        )}
      </div>
    </div>
  );
}