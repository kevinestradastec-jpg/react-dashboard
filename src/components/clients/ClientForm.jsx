import React, { useEffect, useState } from "react";

const defaultForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "other",
  tier: "bronze",
  status: "active",
};

export default function ClientForm({
  client,
  open,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  // 🔥 Fix for edit mode (important)
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        company: client.company || "",
        email: client.email || "",
        phone: client.phone || "",
        industry: client.industry || "other",
        tier: client.tier || "bronze",
        status: client.status || "active",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [client, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {client ? "Edit Client" : "Add New Client"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Contact Name *</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Company *</label>
              <input
                value={formData.company}
                onChange={(e) =>
                  handleChange("company", e.target.value)
                }
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="Company name"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="+63..."
              />
            </div>
          </div>

          {/* Industry / Tier / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) =>
                  handleChange("industry", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="technology">Technology</option>
                <option value="creative">Creative</option>
                <option value="retail">Retail</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) =>
                  handleChange("tier", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {saving
                ? "Saving..."
                : client
                ? "Update Client"
                : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}