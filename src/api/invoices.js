import { supabase } from "../lib/supabase";

export async function fetchInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((invoice) => ({
    id: invoice.id || "",
    invoice_number: invoice.invoice_number || "",
    client_id: invoice.client_id || "",
    project_id: invoice.project_id || "",
    issue_date: invoice.issue_date || "",
    due_date: invoice.due_date || "",
    amount: Number(invoice.amount || 0),
    status: invoice.status || "draft",
    notes: invoice.notes || "",
    raw: invoice,
  }));
}

export async function createInvoice(invoiceForm) {
  const payload = {
    invoice_number: invoiceForm.invoice_number || "",
    client_id: invoiceForm.client_id || null,
    project_id: invoiceForm.project_id || null,
    issue_date: invoiceForm.issue_date || null,
    due_date: invoiceForm.due_date || null,
    amount: invoiceForm.amount ? Number(invoiceForm.amount) : 0,
    status: invoiceForm.status || "draft",
    notes: invoiceForm.notes || null,
  };

  const { data, error } = await supabase
    .from("invoices")
    .insert([payload])
    .select();

  if (error) throw error;
  return data;
}

export async function updateInvoice(invoiceId, updates) {
  const payload = {
    ...(updates.invoice_number !== undefined && {
      invoice_number: updates.invoice_number,
    }),
    ...(updates.client_id !== undefined && {
      client_id: updates.client_id || null,
    }),
    ...(updates.project_id !== undefined && {
      project_id: updates.project_id || null,
    }),
    ...(updates.issue_date !== undefined && {
      issue_date: updates.issue_date || null,
    }),
    ...(updates.due_date !== undefined && {
      due_date: updates.due_date || null,
    }),
    ...(updates.amount !== undefined && {
      amount: updates.amount ? Number(updates.amount) : 0,
    }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(updates.notes !== undefined && { notes: updates.notes || null }),
  };

  const { data, error } = await supabase
    .from("invoices")
    .update(payload)
    .eq("id", invoiceId)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteInvoice(invoiceId) {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) throw error;
}