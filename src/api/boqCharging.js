import { supabase } from "../lib/supabase";

export async function fetchBOQChargingItems() {
  const { data, error } = await supabase
    .from("boq_charging_items")
    .select("*")
    .order("category_code", { ascending: true })
    .order("section_code", { ascending: true })
    .order("item_code", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createBOQChargingItem(item) {
  const { data, error } = await supabase
    .from("boq_charging_items")
    .insert([item])
    .select();

  if (error) throw error;
  return data;
}

export async function updateBOQChargingItem(id, updates) {
  const { data, error } = await supabase
    .from("boq_charging_items")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteBOQChargingItem(id) {
  const { error } = await supabase
    .from("boq_charging_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}