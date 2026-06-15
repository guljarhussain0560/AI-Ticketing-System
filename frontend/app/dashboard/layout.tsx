"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Building2,
  UserCog,
  LogOut,
  User as UserIcon,
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  Settings
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { username, roles, logout } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Departments", href: "/dashboard/departments", icon: Building2 },
    { name: "User Management", href: "/dashboard/users", icon: UserCog, adminOnly: true },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const userRoles = roles || [];
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const getPageTitle = () => {
    const matched = navItems.find((item) => item.href === pathname);
    return matched ? matched.name : "System Desk";
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 border-r border-slate-900 bg-slate-900/40 backdrop-blur-xl">
          {/* Logo Section */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30">
              A
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-400">
              AURA
            </span>
            <div className="ml-auto rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
              v1.0
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Footer Profile */}
          <div className="border-t border-slate-900 p-4 bg-slate-900/10">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                <UserIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold text-slate-200">{username}</p>
                <p className="truncate text-xs text-indigo-400 font-medium">
                  {isAdmin ? "Administrator" : "Support Agent"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-900 hover:text-red-400 transition-colors duration-200 cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile Menu */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full animate-in slide-in-from-left duration-300">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-2 mb-8 mt-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30">
                  A
                </div>
                <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-400">
                  AURA
                </span>
              </div>

              <nav className="flex-1 space-y-2">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-800 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                    <UserIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-slate-200">{username}</p>
                    <p className="truncate text-xs text-indigo-400 font-medium">
                      {isAdmin ? "Administrator" : "Support Agent"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-slate-400 hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="flex flex-1 flex-col overflow-x-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950 px-4 md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 md:hidden focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-bold text-slate-100">{getPageTitle()}</h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Search Box - Desktop */}
              <div className="relative hidden sm:block w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets, customers..."
                  className="block w-full rounded-xl border border-slate-900 bg-slate-900/30 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50"
                />
              </div>

              {/* Notification icon */}
              <button className="relative rounded-xl border border-slate-900 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500"></span>
              </button>

              {/* Quick AI Tag */}
              <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>AI Agent Active</span>
              </div>
            </div>
          </header>

          {/* Main Workspace Area */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
