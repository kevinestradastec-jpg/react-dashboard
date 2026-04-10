import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { cn } from "../../lib/utils";

const columnStyles = {
  todo: "border-t-slate-400",
  in_progress: "border-t-blue-500",
  review: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

const columnLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};

export default function KanbanColumn({
  status,
  tasks = [],
  onTaskClick,
}) {
  return (
    <div
      className={cn(
        "bg-slate-50 rounded-xl border-t-4 min-h-[400px] flex flex-col",
        columnStyles[status] || "border-t-slate-300"
      )}
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">
            {columnLabels[status] || status}
          </h3>

          <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 space-y-3 overflow-y-auto transition-colors",
              snapshot.isDraggingOver && "bg-slate-100"
            )}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(provided) => (
                  <TaskCard
                    task={task}
                    provided={provided}
                    onClick={() => onTaskClick(task)}
                  />
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}