import React from "react";
import { format, isBefore, addDays } from "date-fns";
import { Clock, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function DeadlinesList({ tasks = [] }) {
  const upcomingTasks = tasks
    .filter((task) => task.due_date && task.status !== "completed")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const getDateColor = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();

    if (isBefore(date, today)) return "text-red-600 bg-red-50";
    if (isBefore(date, addDays(today, 3))) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-full">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span>Upcoming Deadlines</span>
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {upcomingTasks.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No upcoming deadlines
          </p>
        ) : (
          upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {task.title}
                </p>
                <p
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full inline-block mt-1",
                    getDateColor(task.due_date)
                  )}
                >
                  Due {format(new Date(task.due_date), "MMM d, yyyy")}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}