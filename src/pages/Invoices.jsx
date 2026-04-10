import React, { useEffect, useState } from "react";
import { Search, Plus, FileText } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import InvoiceRow from "../components/invoices/InvoiceRow";
import InvoiceForm from "../components/invoices/InvoiceForm";

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
      const mockClients = [
        { id: 1, company: "ABC Corp" },
        { id: 2, company: "XYZ Trading" },
      ];

      const mockProjects = [
        { id: 1, name: "Solar Installation" },
        { id: 2, name: "Electrical Upgrade" },
      ];

      const mockInvoices = [
        {
          id: 1,
          invoice_number: "INV-001",
          client_id: 1,
          project_id: 1,
          issue_date: "2026-04-01",
          due_date: "2026-04-15",
          amount: 25000,
          status: "sent",
        },
        {
          id: 2,
          invoice_number: "INV-002",
          client_id: 2,
          project_id: 2,
          issue_date: "2026-03-25",
          due_date: "2026-04-05",
          amount: 18000,
          status: "paid",
        },
      ];

      setInvoices(mockInvoices);
      setClients(mockClients);
      setProjects(mockProjects);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (data) => {
    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === editingInvoice.id
            ? { ...invoice, ...data }
            : invoice
        )
      );
    } else {
      setInvoices((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...data,
        },
      ]);
    }

    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleMarkPaid = (invoice) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoice.id ? { ...item, status: "paid" } : item
      )
    );
  };

  const handleDelete = (invoice) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    setInvoices((prev) => prev.filter((item) => item.id !== invoice.id));
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client?.company || client?.name || "Unknown";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = getClientName(invoice.client_id);

    const matchesSearch =
      invoice.invoice_number
        ?.toLowerCase()
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
    totalValue: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
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
          onClick={() => setShowForm(true)}
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
          value={`$${stats.totalValue.toLocaleString()}`}
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
            onClick={() => setShowForm(true)}
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