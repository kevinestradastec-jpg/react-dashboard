import { supabase } from "../lib/supabase";

export async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((task) => ({
    id: task.id || "",
    title: task.title || "Untitled Task",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    projectId: task.project_id || "",
    projectName: task.project_name || "",
    dueDate: task.due_date || "",
    assignedTo: task.assigned_to || "",
    raw: task,
  }));
}

export async function createTask(taskForm) {
  const payload = {
    title: taskForm.title || "",
    description: taskForm.description || "",
    status: taskForm.status || "todo",
    priority: taskForm.priority || "medium",
    project_id: taskForm.projectId || null,
    project_name: taskForm.projectName || null,
    due_date: taskForm.dueDate || null,
    assigned_to: taskForm.assignedTo || null,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert([payload])
    .select();

  if (error) throw error;
  return data;
}

export async function updateTask(taskId, updates) {
  const payload = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(updates.priority !== undefined && { priority: updates.priority }),
    ...(updates.projectId !== undefined && { project_id: updates.projectId || null }),
    ...(updates.projectName !== undefined && {
      project_name: updates.projectName || null,
    }),
    ...(updates.dueDate !== undefined && { due_date: updates.dueDate || null }),
    ...(updates.assignedTo !== undefined && {
      assigned_to: updates.assignedTo || null,
    }),
  };

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", taskId)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteTask(taskId) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
}