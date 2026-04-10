import React from "react";
import { Mail, Phone, Building } from "lucide-react";
import { cn } from "../../lib/utils";

const tierColors = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-slate-200 text-slate-700",
  gold: "bg-amber-100 text-amber-700",
  platinum: "bg-purple-100 text-purple-700",
};

export default function ClientCard({ client, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500">
          <Building className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
            {client.name}
          </h3>
          <p className="text-sm text-slate-500">
            {client.company || "No company"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate">{client.email}</span>
          </div>
        )}

        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{client.phone}</span>
          </div>
        )}

        {client.industry && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building className="w-4 h-4 text-slate-400" />
            <span className="capitalize">{client.industry}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
            tierColors[client.tier] || "bg-slate-100 text-slate-600"
          )}
        >
          {client.tier || "none"}
        </span>

        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
            client.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          )}
        >
          {client.status || "unknown"}
        </span>
      </div>
    </div>
  );
}