"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "axios";
import { KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { username, roles } = useAuthStore();
  const isAdmin = roles?.includes("ROLE_ADMIN");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess("Password changed successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password. Please verify your current password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Account Settings</h1>
        <p className="text-sm text-slate-400">Manage your profile and security preferences.</p>
      </div>

      {/* Profile Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-indigo-400 border border-slate-700 shadow-lg shadow-indigo-500/10">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-200">{username}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isAdmin
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                {isAdmin ? 'Administrator' : 'Support Agent'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">Change Password</h3>
            <p className="text-sm text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-500/10 p-4 border border-red-500/20 text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Current Password</label>
              <input
                required
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">New Password</label>
              <input
                required
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm New Password</label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
                placeholder="Must match new password"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
