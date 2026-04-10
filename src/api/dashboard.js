import { supabase } from "../lib/supabase";

export async function getDashboardStats() {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) throw error;

  const projects = data || [];

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const creatingProjects = projects.filter((p) => p.status === "Creating").length;
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);

  const upcomingDeadlines = [...projects]
    .filter((p) => p.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    creatingProjects,
    totalBudget,
    upcomingDeadlines,
    recentProjects,
  };
}