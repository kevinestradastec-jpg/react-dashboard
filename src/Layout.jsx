import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Plus,
  Menu,
  ShoppingCart,
  ChevronDown,
  Wallet,
  Truck,
  ClipboardList,
  Boxes,
  Fuel,
  Package,
} from "lucide-react";
import { cn } from "./lib/utils";

export default function Layout({ children, currentPageName }) {
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [budgetExpanded, setBudgetExpanded] = useState(true);
  const [procurementExpanded, setProcurementExpanded] = useState(true);
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [payrollExpanded, setPayrollExpanded] = useState(true);
  const [projectProgressExpanded, setProjectProgressExpanded] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
    { name: "Projects", icon: FolderKanban, page: "Projects" },
    { name: "Tasks", icon: CheckSquare, page: "Tasks" },
    { name: "Calendar", icon: Calendar, page: "Calendar" },
    { name: "Analytics", icon: BarChart3, page: "Analytics" },
  ];

  const budgetItems = [
    { name: "Bill of Quantities", page: "BillOfQuantities" },
    { name: "BOQ Charging", page: "BOQCharging" },
    { name: "Expense Overview", page: "ExpenseOverview" },
    { name: "Look Ahead", page: "LookAhead" },
  ];

  const procurementItems = [
    { name: "Dashboard", page: "ProcurementDashboard" },
    { name: "Request", page: "Request" },
    { name: "Local", page: "Local" },
    { name: "Manila", page: "Manila" },
  ];

  const inventoryItems = [
    { name: "Materials", page: "InventoryMaterials" },
    { name: "Fuels", page: "InventoryFuels" },
  ];

  const payrollItems = [{ name: "Manpower", page: "Manpower" }];

  const projectProgressItems = [
    { name: "Project Schedule", page: "ProjectSchedule" },
    { name: "Activity Report", page: "ActivityReport" },
    { name: "Site Photos", page: "SitePhotos" },
    { name: "Task", page: "Tasks" },
  ];

  const quickActions = [
    {
      name: "New Project",
      icon: Plus,
      page: "Projects",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "New Task",
      icon: CheckSquare,
      page: "Tasks",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  const expanded = hovered;

  const renderSectionItems = (items, mobile = false, level = 0) =>
    items.map((item) => {
      const isActive = currentPageName === item.page;
      return (
        <Link
          key={item.page}
          to={`/${item.page}`}
          onClick={() => mobile && setMobileOpen(false)}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap",
            level === 0 ? "ml-6" : "ml-10",
            isActive
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          {item.name}
        </Link>
      );
    });

  const Sidebar = ({ mobile = false }) => (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ease-in-out",
        mobile ? "w-64" : expanded ? "w-64" : "w-16"
      )}
    >
      <div className="p-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              expanded || mobile ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}
          >
            <h1 className="font-bold text-slate-800 whitespace-nowrap">
              Project Portal
            </h1>
            <p className="text-xs text-slate-500 whitespace-nowrap">
              Professional Project Management
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {(expanded || mobile) && (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 whitespace-nowrap">
            Navigation
          </p>
        )}

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={`/${item.page}`}
                onClick={() => mobile && setMobileOpen(false)}
                title={!expanded && !mobile ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && "text-blue-600"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap overflow-hidden transition-all duration-300",
                    expanded || mobile
                      ? "opacity-100 max-w-xs"
                      : "opacity-0 max-w-0 w-0"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {(expanded || mobile) ? (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2 whitespace-nowrap">
              Budget
            </p>

            <button
              onClick={() => setBudgetExpanded(!budgetExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all mb-1"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Budget</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform flex-shrink-0",
                  budgetExpanded && "rotate-180"
                )}
              />
            </button>

            {budgetExpanded && <div className="space-y-1">{renderSectionItems(budgetItems, mobile)}</div>}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2 whitespace-nowrap">
              Procurement
            </p>

            <button
              onClick={() => setProcurementExpanded(!procurementExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all mb-1"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Procurement</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform flex-shrink-0",
                  procurementExpanded && "rotate-180"
                )}
              />
            </button>

            {procurementExpanded && (
              <div className="space-y-1">
                {renderSectionItems(procurementItems, mobile)}

                <button
                  onClick={() => setInventoryExpanded(!inventoryExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all ml-6 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Inventory</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform flex-shrink-0",
                      inventoryExpanded && "rotate-180"
                    )}
                  />
                </button>

                {inventoryExpanded && (
                  <div className="space-y-1">
                    {renderSectionItems(inventoryItems, mobile, 1)}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2 whitespace-nowrap">
              Payroll
            </p>

            <button
              onClick={() => setPayrollExpanded(!payrollExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all mb-1"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Payroll</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform flex-shrink-0",
                  payrollExpanded && "rotate-180"
                )}
              />
            </button>

            {payrollExpanded && <div className="space-y-1">{renderSectionItems(payrollItems, mobile)}</div>}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2 whitespace-nowrap">
              Project Progress
            </p>

            <button
              onClick={() => setProjectProgressExpanded(!projectProgressExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all mb-1"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  Project Progress
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform flex-shrink-0",
                  projectProgressExpanded && "rotate-180"
                )}
              />
            </button>

            {projectProgressExpanded && (
              <div className="space-y-1">
                {renderSectionItems(projectProgressItems, mobile)}
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="px-3 py-2.5 text-slate-600">
              <Wallet className="w-5 h-5" title="Budget" />
            </div>
            <div className="px-3 py-2.5 text-slate-600">
              <ShoppingCart className="w-5 h-5" title="Procurement" />
            </div>
            <div className="px-3 py-2.5 text-slate-600">
              <Truck className="w-5 h-5" title="Payroll" />
            </div>
            <div className="px-3 py-2.5 text-slate-600">
              <ClipboardList className="w-5 h-5" title="Project Progress" />
            </div>
          </div>
        )}

        {(expanded || mobile) && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2 whitespace-nowrap">
              Quick Actions
            </p>

            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={`/${action.page}`}
                  onClick={() => mobile && setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-white transition-all",
                    action.color
                  )}
                >
                  <action.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {action.name}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div
        className="hidden lg:block fixed top-0 left-0 h-full z-40"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={cn(
            "h-full shadow-xl transition-all duration-300 ease-in-out",
            expanded ? "w-64" : "w-16"
          )}
        >
          <Sidebar />
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen lg:ml-16">
        <div className="lg:hidden flex items-center gap-4 p-4 bg-white border-b border-slate-200">
          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">Project Portal</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}