import { supabase } from "../lib/supabase";

export async function fetchBOQItems() {
  const { data, error } = await supabase
    .from("boq_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sub_category", { ascending: true })
    .order("item_name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createBOQItem(item) {
  const { data, error } = await supabase
    .from("boq_items")
    .insert([item])
    .select();

  if (error) throw error;
  return data;
}

export async function updateBOQItem(id, updates) {
  const { data, error } = await supabase
    .from("boq_items")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteBOQItem(id) {
  const { error } = await supabase
    .from("boq_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}