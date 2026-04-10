import { supabase } from "../lib/supabase";

export async function fetchClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((client) => ({
    id: client.id,
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    status: client.status,
    tier: client.tier,
    industry: client.industry,
    total_revenue: Number(client.total_revenue || 0),
    score: Number(client.score || 0),
    address: client.address,
    notes: client.notes,
  }));
}

export async function createClient(form) {
  const { data, error } = await supabase
    .from("clients")
    .insert([
      {
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        status: form.status,
        tier: form.tier,
        industry: form.industry,
        total_revenue: Number(form.total_revenue || 0),
        score: Number(form.score || 0),
        address: form.address,
        notes: form.notes,
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function updateClient(id, form) {
  const { data, error } = await supabase
    .from("clients")
    .update({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      status: form.status,
      tier: form.tier,
      industry: form.industry,
      total_revenue: Number(form.total_revenue || 0),
      score: Number(form.score || 0),
      address: form.address,
      notes: form.notes,
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteClient(id) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}