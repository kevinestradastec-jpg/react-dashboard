import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Users,
  DollarSign,
  Star,
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import ClientCard from "../components/clients/ClientCard";
import ClientForm from "../components/clients/ClientForm";
import {
  fetchClients,
  createClient,
  updateClient,
} from "../api/clients";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
      } else {
        await createClient(data);
      }

      await loadData();
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert("Failed to save client.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      String(c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(c.company || "").toLowerCase().includes(search.toLowerCase());

    const matchesTier =
      tierFilter === "all" || c.tier === tierFilter;

    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;

    const matchesIndustry =
      industryFilter === "all" || c.industry === industryFilter;

    return (
      matchesSearch &&
      matchesTier &&
      matchesStatus &&
      matchesIndustry
    );
  });

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    revenue: clients.reduce(
      (sum, c) => sum + Number(c.total_revenue || 0),
      0
    ),
    avgScore:
      clients.length > 0
        ? (
            clients.reduce((sum, c) => sum + Number(c.score || 0), 0) /
            clients.length
          ).toFixed(1)
        : 0,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            All Clients
          </h1>
          <p className="text-slate-500">
            Manage and view your clients
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClient(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Clients" value={stats.total} icon={Users} />
        <StatsCard title="Active" value={stats.active} icon={Users} />
        <StatsCard
          title="Revenue"
          value={`₱${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard title="Avg. Score" value={stats.avgScore} icon={Star} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-lg border py-2 pl-10 pr-3"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Tiers</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Industries</option>
          <option value="technology">Technology</option>
          <option value="creative">Creative</option>
          <option value="retail">Retail</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
      </div>

      <p className="text-sm text-slate-600">
        Showing {filteredClients.length} of {clients.length} clients
      </p>

      {filteredClients.length === 0 ? (
        <div className="py-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3>No clients found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => {
                setEditingClient(client);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}

      <ClientForm
        client={editingClient}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingClient(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}