import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Folder,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { fetchBOQChargingItems } from "../api/boqCharging";

const statusTabs = ["All", "Paid", "Unpaid"];

export default function BOQCharging() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    loadBOQCharging();
  }, []);

  async function loadBOQCharging() {
    try {
      setLoading(true);
      const data = await fetchBOQChargingItems();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load BOQ charging items:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        String(row.category || "").toLowerCase().includes(searchValue) ||
        String(row.section || "").toLowerCase().includes(searchValue) ||
        String(row.charging || "").toLowerCase().includes(searchValue) ||
        String(row.item_code || "").toLowerCase().includes(searchValue) ||
        String(row.category_code || "").toLowerCase().includes(searchValue) ||
        String(row.section_code || "").toLowerCase().includes(searchValue) ||
        String(row.dept || "").toLowerCase().includes(searchValue);

      const paid = Number(row.paid_total || 0);
      const unpaid = Number(row.unpaid_total || 0);

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Paid" && paid > 0) ||
        (activeTab === "Unpaid" && unpaid > 0);

      return matchesSearch && matchesTab;
    });
  }, [rows, search, activeTab]);

  const groupedData = useMemo(() => {
    return groupBOQChargingRows(filteredRows);
  }, [filteredRows]);

  const dashboardTotals = useMemo(() => {
    const allottedBudget = sumBy(filteredRows, "allotted_budget");
    const totalPaid = sumBy(filteredRows, "paid_total");
    const totalUnpaid = sumBy(filteredRows, "unpaid_total");
    const grandTotal = filteredRows.reduce((sum, row) => {
      const paid = Number(row.paid_total || 0);
      const unpaid = Number(row.unpaid_total || 0);
      const actual = Number(row.actual_expenses || 0);
      return sum + (actual || paid + unpaid);
    }, 0);

    const remaining = filteredRows.reduce((sum, row) => {
      const allotted = Number(row.allotted_budget || 0);
      const paid = Number(row.paid_total || 0);
      const unpaid = Number(row.unpaid_total || 0);
      const actual = Number(row.actual_expenses || 0);
      const computedTotal = actual || paid + unpaid;
      const storedRemaining = row.remaining_budget;

      return sum + Number(storedRemaining ?? allotted - computedTotal);
    }, 0);

    return {
      allottedBudget,
      totalPaid,
      totalUnpaid,
      grandTotal,
      remaining,
    };
  }, [filteredRows]);

  const toggleCategory = (key) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }));
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
        <div className="h-24 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">BOQ Charging</h1>
            <p className="text-sm text-slate-500">Monitor charging and allocation</p>
          </div>

          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50">
            <Folder className="h-5 w-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">Alcantara</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
            <Bell className="h-5 w-5 text-slate-700" />
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
            <SlidersHorizontal className="h-5 w-5 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Allotted Budget" value={dashboardTotals.allottedBudget} />
        <SummaryCard title="Total Paid" value={dashboardTotals.totalPaid} />
        <SummaryCard title="Total Unpaid" value={dashboardTotals.totalUnpaid} />
        <SummaryCard title="Grand Total" value={dashboardTotals.grandTotal} />
        <SummaryCard title="Remaining" value={dashboardTotals.remaining} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 p-1 bg-slate-50">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, dept, charging..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none"
          />
        </div>

        <button
          onClick={loadBOQCharging}
          className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50"
        >
          <RefreshCw className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {groupedData.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          No BOQ charging records found.
        </div>
      ) : (
        <div className="space-y-4">
          {groupedData.map((categoryBlock) => {
            const categoryKey = categoryBlock.category_code || categoryBlock.category;
            const isCategoryExpanded = expandedCategories[categoryKey] ?? true;
            const categoryTotals = calculateTotals(categoryBlock.rows);

            return (
              <div
                key={categoryKey}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {isCategoryExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    )}
                    <span className="text-2xl font-bold text-slate-900 uppercase">
                      {categoryBlock.category}
                    </span>
                  </div>

                  <span className="text-sm text-slate-500">
                    {categoryBlock.category_code || ""}
                  </span>
                </button>

                {isCategoryExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {categoryBlock.sections.map((sectionBlock) => {
                      const sectionKey = `${categoryKey}__${sectionBlock.section_code || sectionBlock.section}`;
                      const isSectionExpanded = expandedSections[sectionKey] ?? true;
                      const sectionTotals = calculateTotals(sectionBlock.rows);

                      return (
                        <div
                          key={sectionKey}
                          className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
                        >
                          <button
                            onClick={() => toggleSection(sectionKey)}
                            className="w-full flex items-center justify-between px-4 py-4 text-left bg-white"
                          >
                            <div className="flex items-center gap-3">
                              {isSectionExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                              <span className="text-xl font-bold text-slate-900 uppercase">
                                {sectionBlock.section}
                              </span>
                            </div>

                            <div className="text-sm text-slate-500">
                              Allotted:{" "}
                              <span className="font-semibold">
                                {formatCurrency(sectionTotals.allotted)}
                              </span>
                              {" · "}Paid:{" "}
                              <span className="font-semibold">
                                {formatCurrency(sectionTotals.paid)}
                              </span>
                              {" · "}Unpaid:{" "}
                              <span className="font-semibold">
                                {formatCurrency(sectionTotals.unpaid)}
                              </span>
                            </div>
                          </button>

                          {isSectionExpanded && (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 border-t border-slate-200 border-b border-slate-200">
                                  <tr className="text-xs uppercase text-slate-500">
                                    <th className="px-6 py-4 text-left">Charging</th>
                                    <th className="px-4 py-4 text-left">Code</th>
                                    <th className="px-4 py-4 text-left">Dept.</th>
                                    <th className="px-4 py-4 text-left">Allotted</th>
                                    <th className="px-4 py-4 text-left">Paid</th>
                                    <th className="px-4 py-4 text-left">Unpaid</th>
                                    <th className="px-4 py-4 text-left">Total</th>
                                    <th className="px-4 py-4 text-left">Remaining</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {sectionBlock.rows.map((row) => {
                                    const paid = Number(row.paid_total || 0);
                                    const unpaid = Number(row.unpaid_total || 0);
                                    const allotted = Number(row.allotted_budget || 0);
                                    const total = Number(row.actual_expenses || 0) || paid + unpaid;
                                    const remaining =
                                      row.remaining_budget !== null &&
                                      row.remaining_budget !== undefined
                                        ? Number(row.remaining_budget)
                                        : allotted - total;

                                    return (
                                      <tr
                                        key={row.id || row.import_key || row.item_code}
                                        className="border-b border-slate-100"
                                      >
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 uppercase">
                                          {row.charging || "-"}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {row.item_code || "-"}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {row.dept || "-"}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {formatCurrency(allotted)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {formatCurrency(paid)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {formatCurrency(unpaid)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-700">
                                          {formatCurrency(total)}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                                          {formatCurrency(remaining)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              <div className="flex justify-end px-6 py-4 text-sm text-slate-500 border-t border-slate-200 bg-slate-50">
                                Allotted:
                                <span className="ml-1 mr-3 font-semibold text-slate-700">
                                  {formatCurrency(sectionTotals.allotted)}
                                </span>
                                Paid:
                                <span className="ml-1 mr-3 font-semibold text-slate-700">
                                  {formatCurrency(sectionTotals.paid)}
                                </span>
                                Unpaid:
                                <span className="ml-1 mr-3 font-semibold text-slate-700">
                                  {formatCurrency(sectionTotals.unpaid)}
                                </span>
                                Total:
                                <span className="ml-1 mr-3 font-semibold text-slate-700">
                                  {formatCurrency(sectionTotals.total)}
                                </span>
                                Remaining:
                                <span className="ml-1 font-semibold text-slate-700">
                                  {formatCurrency(sectionTotals.remaining)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex justify-end px-2 py-2 text-sm text-slate-500">
                      Allotted:
                      <span className="ml-1 mr-3 font-semibold text-slate-700">
                        {formatCurrency(categoryTotals.allotted)}
                      </span>
                      Paid:
                      <span className="ml-1 mr-3 font-semibold text-slate-700">
                        {formatCurrency(categoryTotals.paid)}
                      </span>
                      Unpaid:
                      <span className="ml-1 mr-3 font-semibold text-slate-700">
                        {formatCurrency(categoryTotals.unpaid)}
                      </span>
                      Total:
                      <span className="ml-1 mr-3 font-semibold text-slate-700">
                        {formatCurrency(categoryTotals.total)}
                      </span>
                      Remaining:
                      <span className="ml-1 font-semibold text-slate-700">
                        {formatCurrency(categoryTotals.remaining)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">
        {formatCurrency(value)}
      </h3>
    </div>
  );
}

function groupBOQChargingRows(rows) {
  const grouped = {};

  for (const row of rows) {
    const categoryCode = row.category_code || "UNCAT";
    const category = row.category || "Uncategorized";
    const sectionCode = row.section_code || "GEN";
    const section = row.section || "General";

    if (!grouped[categoryCode]) {
      grouped[categoryCode] = {
        category_code: categoryCode,
        category,
        rows: [],
        sections: {},
      };
    }

    grouped[categoryCode].rows.push(row);

    if (!grouped[categoryCode].sections[sectionCode]) {
      grouped[categoryCode].sections[sectionCode] = {
        section_code: sectionCode,
        section,
        rows: [],
      };
    }

    grouped[categoryCode].sections[sectionCode].rows.push(row);
  }

  return Object.values(grouped)
    .map((categoryBlock) => ({
      ...categoryBlock,
      sections: Object.values(categoryBlock.sections).sort((a, b) =>
        String(a.section_code).localeCompare(String(b.section_code), undefined, {
          numeric: true,
          sensitivity: "base",
        })
      ),
    }))
    .sort((a, b) =>
      String(a.category_code).localeCompare(String(b.category_code), undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
}

function calculateTotals(rows) {
  const allotted = sumBy(rows, "allotted_budget");
  const paid = sumBy(rows, "paid_total");
  const unpaid = sumBy(rows, "unpaid_total");

  const total = rows.reduce((sum, row) => {
    const paidVal = Number(row.paid_total || 0);
    const unpaidVal = Number(row.unpaid_total || 0);
    const actualVal = Number(row.actual_expenses || 0);
    return sum + (actualVal || paidVal + unpaidVal);
  }, 0);

  const remaining = rows.reduce((sum, row) => {
    const allottedVal = Number(row.allotted_budget || 0);
    const paidVal = Number(row.paid_total || 0);
    const unpaidVal = Number(row.unpaid_total || 0);
    const actualVal = Number(row.actual_expenses || 0);
    const totalVal = actualVal || paidVal + unpaidVal;

    return sum + Number(row.remaining_budget ?? allottedVal - totalVal);
  }, 0);

  return {
    allotted,
    paid,
    unpaid,
    total,
    remaining,
  };
}

function sumBy(rows, field) {
  return rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}