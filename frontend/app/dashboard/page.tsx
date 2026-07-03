"use client";

import { useAuthStore } from "@/store/authStore";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Inbox
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { username } = useAuthStore();

  const stats = [
    {
      name: "Total Open Tickets",
      value: "14",
      change: "+4 this hour",
      icon: Ticket,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    {
      name: "Urgent Escalations",
      value: "3",
      change: "SLA approaching",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      name: "Resolved Today",
      value: "28",
      change: "92% success rate",
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      name: "Avg Response Time",
      value: "8.4m",
      change: "-2m under target",
      icon: Clock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
  ];

  const recentTickets = [
    { id: "TCK-1092", subject: "Server connection timeout error", customer: "Sophia Chen", category: "Infrastructure", priority: "HIGH", status: "OPEN", time: "5 mins ago" },
    { id: "TCK-1091", subject: "Billing duplicate charge inquiry", customer: "Alex Mercer", category: "Finance", priority: "MEDIUM", status: "IN_PROGRESS", time: "14 mins ago" },
    { id: "TCK-1090", subject: "Requesting custom API access tokens", customer: "Dr. Evelyn Vance", category: "Access Control", priority: "LOW", status: "OPEN", time: "30 mins ago" },
    { id: "TCK-1089", subject: "Email integration fails on attachments", customer: "Marcus Brodie", category: "Integration", priority: "HIGH", status: "RESOLVED", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900/60 via-slate-950 to-indigo-950/20 p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-[50px]"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>AI Operations desk</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {username}!
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl">
            AURA has analyzed <strong className="text-indigo-400 font-medium">142 customer emails</strong> in the last 24 hours. The queue is currently stable with normal priority levels.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`rounded-2xl border ${stat.border} bg-slate-900/20 p-6 backdrop-blur-md hover:scale-[1.01] transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.name}
                </span>
                <div className={`rounded-xl ${stat.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stat.value}</span>
                <span className="text-xs font-semibold text-slate-500">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left/Middle Column: Recent Tickets */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/25 p-6 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Live Ticket Queue</h3>
              <p className="text-xs text-slate-500">Real-time incoming customer tickets analyzed by AURA</p>
            </div>
            <Link
              href="/dashboard/tickets"
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>View All Queue</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-900 flex-1">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 tracking-wider font-mono">
                      {ticket.id}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{ticket.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors duration-150">
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>From: {ticket.customer}</span>
                    <span>•</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-400">{ticket.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${
                      ticket.priority === "HIGH"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : ticket.priority === "MEDIUM"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}
                  >
                    {ticket.priority}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                      ticket.status === "OPEN"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Actions & Channels */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/25 p-6 backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Quick Operations</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center hover:bg-slate-900 transition-colors group cursor-pointer">
                <Ticket className="h-6 w-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-300">Create Ticket</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center hover:bg-slate-900 transition-colors group cursor-pointer">
                <Inbox className="h-6 w-6 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-300">Sync Emails</span>
              </button>
            </div>
          </div>

          {/* AI Productivity */}
          <div className="rounded-2xl border border-indigo-500/10 bg-indigo-950/5 p-6 backdrop-blur-md border-l-4 border-l-indigo-600">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-slate-200">AI Productivity Tip</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the Auto-Reply generator to draft standard answers. AURA predicts a <strong className="text-indigo-400 font-semibold">94% time savings</strong> on standard access request inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
