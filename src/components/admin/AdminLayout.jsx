import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Layers
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children, title }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders & Verification", path: "/admin/orders", icon: ShoppingBag },
    { name: "Store Settings", path: "/admin/settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-[#e8e4d9] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-[#1c1c1c] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#1c1c1c] flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-[#222]" />
            <div>
              <h2 className="font-cinzel text-sm font-bold tracking-widest text-[#e8e4d9]">
                LOST LABEL
              </h2>
              <span className="font-editorial text-[9px] tracking-[0.25em] text-amber-400">
                ATELIER ADMIN
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1 text-left">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${
                    isActive
                      ? "bg-[#181818] text-[#e8e4d9] border-l-2 border-[#e8e4d9]"
                      : "text-[#777] hover:text-[#e8e4d9] hover:bg-[#121212]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="p-4 border-t border-[#1c1c1c] space-y-2 text-left">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 text-xs text-[#777] hover:text-[#e8e4d9] transition-colors"
          >
            <span className="uppercase tracking-wider">Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-400/80 hover:text-rose-300 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="px-6 py-4 border-b border-[#1c1c1c] bg-[#0a0a0a]/50 backdrop-blur-sm flex items-center justify-between">
          <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-wider uppercase text-[#e8e4d9]">
            {title || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#666] hidden sm:inline">
              {user?.email || "Admin"}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Operational" />
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
