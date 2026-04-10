import React from "react";
import { format } from "date-fns";
import { DollarSign, Trash2, Pencil } from "lucide-react";
import { cn } from "../../lib/utils";

const statusColors = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
};

export default function InvoiceRow({
  invoice,
  clientName,
  onEdit,
  onMarkPaid,
  onDelete,
}) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-800">
        {invoice.invoice_number}
      </td>

      <td className="px-6 py-4 text-slate-600">{clientName}</td>

      <td className="px-6 py-4 text-slate-600">
        {invoice.issue_date
          ? format(new Date(invoice.issue_date), "MMM d, yyyy")
          : "-"}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {invoice.due_date
          ? format(new Date(invoice.due_date), "MMM d, yyyy")
          : "-"}
      </td>

      <td className="px-6 py-4 font-semibold text-slate-800">
        ${Number(invoice.amount || 0).toLocaleString()}
      </td>

      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusColors[invoice.status] || "bg-slate-100 text-slate-600"
          )}
        >
          {invoice.status
            ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
            : "Unknown"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            title="Edit invoice"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {invoice.status !== "paid" && (
            <button
              type="button"
              onClick={() => onMarkPaid(invoice)}
              className="p-2 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Mark as paid"
            >
              <DollarSign className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(invoice)}
            className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Delete invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}