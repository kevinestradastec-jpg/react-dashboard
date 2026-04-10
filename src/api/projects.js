import { supabase } from "../lib/supabase";

export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((project) => ({
    id: project.id || "",
    name: project.project_name || "Untitled Project",
    description: project.project_description || "",
    projectType: project.project_type || "",
    clientId: project.client_id || "",
    clientName: project.client_name || "",
    status: project.status || "",
    startDate: project.start_date || "",
    deadline: project.deadline || "",
    budget: Number(project.budget || 0),
    raw: project,
  }));
}

export async function createProject(projectForm) {
  const payload = {
    project_name: projectForm.ProjectName,
    project_description: projectForm.ProjectDescription,
    project_type: projectForm.projectType,
    client_id: projectForm.ClientId || null,
    client_name: projectForm.ClientName || null,
    status: projectForm.Status,
    start_date: projectForm.StartDate || null,
    deadline: projectForm.Deadline || null,
    budget: projectForm.Budget ? Number(projectForm.Budget) : 0,
    created_by_email: projectForm.CreatedByEmail || null,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([payload])
    .select();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function updateProject(projectId, updates) {
  const payload = {
    ...(updates.ProjectName !== undefined && { project_name: updates.ProjectName }),
    ...(updates.ProjectDescription !== undefined && {
      project_description: updates.ProjectDescription,
    }),
    ...(updates.projectType !== undefined && { project_type: updates.projectType }),
    ...(updates.ClientId !== undefined && { client_id: updates.ClientId || null }),
    ...(updates.ClientName !== undefined && { client_name: updates.ClientName || null }),
    ...(updates.Status !== undefined && { status: updates.Status }),
    ...(updates.StartDate !== undefined && { start_date: updates.StartDate || null }),
    ...(updates.Deadline !== undefined && { deadline: updates.Deadline || null }),
    ...(updates.Budget !== undefined && {
      budget: updates.Budget ? Number(updates.Budget) : 0,
    }),
    ...(updates.CreatedByEmail !== undefined && {
      created_by_email: updates.CreatedByEmail || null,
    }),
  };

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", projectId)
    .select();

  if (error) throw error;
  return data;
}