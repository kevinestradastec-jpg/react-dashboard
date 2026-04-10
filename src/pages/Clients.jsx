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
      // 🔥 Mock data (replace later with API)
      const mockClients = [
        {
          id: 1,
          name: "Juan Dela Cruz",
          company: "ABC Corp",
          status: "active",
          tier: "gold",
          industry: "technology",
          total_revenue: 50000,
          score: 4.5,
        },
        {
          id: 2,
          name: "Maria Santos",
          company: "XYZ Ltd",
          status: "inactive",
          tier: "silver",
          industry: "retail",
          total_revenue: 20000,
          score: 3.8,
        },
      ];

      setClients(mockClients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (data) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id ? { ...c, ...data } : c
        )
      );
    } else {
      setClients((prev) => [
        ...prev,
        { id: Date.now(), ...data },
      ]);
    }

    setShowForm(false);
    setEditingClient(null);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase());

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
      (sum, c) => sum + (c.total_revenue || 0),
      0
    ),
    avgScore:
      clients.length > 0
        ? (
            clients.reduce((sum, c) => sum + (c.score || 0), 0) /
            clients.length
          ).toFixed(1)
        : 0,
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            All Clients
          </h1>
          <p className="text-slate-500">
            Manage and view your clients
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Clients" value={stats.total} icon={Users} />
        <StatsCard title="Active" value={stats.active} icon={Users} />
        <StatsCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard title="Avg. Score" value={stats.avgScore} icon={Star} />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="pl-10 pr-3 py-2 border rounded-lg w-full"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
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
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
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

      {/* Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3>No clients found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Form */}
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