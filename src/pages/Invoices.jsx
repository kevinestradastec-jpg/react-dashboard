import React, { useEffect, useState } from "react";
import { Search, Plus, FileText } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import InvoiceRow from "../components/invoices/InvoiceRow";
import InvoiceForm from "../components/invoices/InvoiceForm";
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../api/invoices";
import { fetchClients } from "../api/clients";
import { fetchProjects } from "../api/projects";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [invoicesData, clientsData, projectsData] = await Promise.all([
        fetchInvoices(),
        fetchClients(),
        fetchProjects(),
      ]);

      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error("Failed to load invoices data:", error);
      setInvoices([]);
      setClients([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, data);
      } else {
        await createInvoice(data);
      }

      await loadData();
      setShowForm(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice.");
    }
  };

  const handleMarkPaid = async (invoice) => {
    try {
      await updateInvoice(invoice.id, { status: "paid" });
      await loadData();
    } catch (error) {
      console.error("Failed to mark invoice as paid:", error);
      alert("Failed to update invoice.");
    }
  };

  const handleDelete = async (invoice) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      await deleteInvoice(invoice.id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete invoice.");
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client?.company || client?.name || "Unknown";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = getClientName(invoice.client_id);

    const matchesSearch =
      String(invoice.invoice_number || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    outstanding: invoices.filter((i) =>
      ["sent", "overdue"].includes(i.status)
    ).length,
    totalValue: invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0),
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-slate-500">
            Create, manage, and track your invoices
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInvoice(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Invoices" value={stats.total} icon={FileText} />
        <StatsCard title="Paid" value={stats.paid} icon={FileText} />
        <StatsCard title="Outstanding" value={stats.outstanding} icon={FileText} />
        <StatsCard
          title="Total Value"
          value={`₱${stats.totalValue.toLocaleString()}`}
          icon={FileText}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by number or client..."
            className="pl-10 pr-3 py-2 border rounded-lg w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-40"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800">
            No invoices found
          </h3>
          <p className="text-slate-500 mt-1">
            Create your first invoice to get started
          </p>
          <button
            onClick={() => {
              setEditingInvoice(null);
              setShowForm(true);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    clientName={getClientName(invoice.client_id)}
                    onEdit={() => {
                      setEditingInvoice(invoice);
                      setShowForm(true);
                    }}
                    onMarkPaid={handleMarkPaid}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InvoiceForm
        invoice={editingInvoice}
        clients={clients}
        projects={projects}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingInvoice(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}