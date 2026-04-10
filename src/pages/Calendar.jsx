import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "../lib/utils";

const eventColors = {
  deadline: "bg-blue-500",
  start: "bg-emerald-500",
  high: "bg-red-500",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mockTasks = [
        {
          id: 1,
          title: "Submit PRS",
          due_date: "2026-04-10",
          status: "in_progress",
          priority: "high",
        },
        {
          id: 2,
          title: "Review BOQ",
          due_date: "2026-04-14",
          status: "todo",
          priority: "medium",
        },
        {
          id: 3,
          title: "Finalize inverter specs",
          due_date: "2026-04-18",
          status: "review",
          priority: "low",
        },
      ];

      const mockProjects = [
        {
          id: 1,
          name: "Solar Installation",
          start_date: "2026-04-08",
          deadline: "2026-04-25",
        },
        {
          id: 2,
          name: "Warehouse Upgrade",
          start_date: "2026-04-12",
          deadline: "2026-04-28",
        },
      ];

      setTasks(mockTasks);
      setProjects(mockProjects);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const getEventsForDate = (date) => {
    if (!date) return [];

    const dateStr = format(date, "yyyy-MM-dd");
    const events = [];

    tasks.forEach((task) => {
      if (task.due_date === dateStr) {
        events.push({
          type: task.priority === "high" ? "high" : "deadline",
          title: task.title,
          entity: "task",
        });
      }
    });

    projects.forEach((project) => {
      if (project.deadline === dateStr) {
        events.push({
          type: "deadline",
          title: project.name,
          entity: "project",
        });
      }

      if (project.start_date === dateStr) {
        events.push({
          type: "start",
          title: project.name,
          entity: "project",
        });
      }
    });

    return events;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const upcomingDeadlines = tasks
    .filter((task) => task.due_date && task.status !== "completed")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-500">
            View and manage your project deadlines and meetings
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
          }}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              {format(currentDate, "MMMM yyyy")}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-slate-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              const events = day ? getEventsForDate(day) : [];
              const isSelected = day && isSameDay(day, selectedDate);
              const isCurrentDay = day && isToday(day);

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={cn(
                    "min-h-[80px] p-2 rounded-lg border cursor-pointer transition-colors",
                    !day && "bg-transparent border-transparent cursor-default",
                    day && "hover:bg-slate-50",
                    isSelected && "border-blue-500 bg-blue-50",
                    !isSelected && day && "border-slate-100"
                  )}
                >
                  {day && (
                    <>
                      <div
                        className={cn(
                          "text-sm font-medium mb-1",
                          isCurrentDay && "text-blue-600",
                          !isCurrentDay && "text-slate-700"
                        )}
                      >
                        {format(day, "d")}
                      </div>

                      <div className="space-y-1">
                        {events.slice(0, 2).map((event, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 rounded-full",
                              eventColors[event.type]
                            )}
                            title={event.title}
                          />
                        ))}

                        {events.length > 2 && (
                          <p className="text-xs text-slate-500">
                            +{events.length - 2} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-2">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>

            {selectedDateEvents.length === 0 ? (
              <p className="text-sm text-slate-500">No events scheduled</p>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={cn("w-2 h-2 rounded-full", eventColors[event.type])}
                    />
                    <span className="text-sm text-slate-700">{event.title}</span>
                    <span className="text-xs text-slate-400 capitalize">
                      {event.entity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Upcoming Deadlines
            </h3>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming deadlines</p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div key={task.id} className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(task.due_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Legend</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-600">Project Deadline</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Project Start</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600">High Priority Task</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}