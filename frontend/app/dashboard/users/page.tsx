"use client";

import React, { useState, useEffect } from "react";
import { User, CreateStaffRequest } from "@/types";
import { useAuthStore } from "@/store/authStore";
import api from "axios";
import { Plus, Check, X, Loader2, KeyRound } from "lucide-react";

export default function UserManagementPage() {
  const { roles } = useAuthStore();
  const isAdmin = roles?.includes("ROLE_ADMIN");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // To display generated credentials after successful creation
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string, password: string } | null>(null);

  const [formData, setFormData] = useState<CreateStaffRequest>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "ROLE_AGENT"
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pwd });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      await api.post("/users/create-staff", formData);
      setCreatedCredentials({
        username: formData.username,
        password: formData.password!
      });
      fetchUsers();
      // Don't close modal immediately so they can copy credentials
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreatedCredentials(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "ROLE_AGENT"
    });
    setCreateError(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-xl bg-red-500/10 p-6 text-center border border-red-500/20">
          <h2 className="text-xl font-bold text-red-400">Access Denied</h2>
          <p className="mt-2 text-slate-300">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-sm text-slate-400">Manage system users, agents, and administrators.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <Plus className="h-4 w-4" />
          Create Staff
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <p className="text-slate-500">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 font-bold text-indigo-400">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          {(user.firstName || user.lastName) && (
                            <p className="text-xs text-slate-500">{user.firstName} {user.lastName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map(role => {
                          const isAdm = role === 'ROLE_ADMIN';
                          const isAgt = role === 'ROLE_AGENT';
                          return (
                            <span
                              key={role}
                              className={`rounded-md px-2 py-1 text-xs font-medium border ${isAdm
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                  : isAgt
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}
                            >
                              {role.replace('ROLE_', '')}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium border ${user.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-100">Create Staff User</h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {createdCredentials ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 mb-3">
                      <Check className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-400 mb-1">User Created Successfully!</h4>
                    <p className="text-sm text-emerald-500/80 mb-4">Please copy these credentials and share them securely.</p>

                    <div className="bg-slate-950 rounded-lg p-4 text-left border border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Username:</span>
                        <span className="text-slate-200 font-mono font-bold select-all">{createdCredentials.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Password:</span>
                        <span className="text-slate-200 font-mono font-bold select-all">{createdCredentials.password}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {createError && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                      {createError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-300">Username *</label>
                      <input
                        required
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900"
                        placeholder="jdoe"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-300">Email *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900"
                        placeholder="jdoe@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex justify-between text-sm font-medium text-slate-300">
                        <span>Temporary Password *</span>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <KeyRound className="h-3 w-3" /> Auto-generate
                        </button>
                      </label>
                      <input
                        required
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 font-mono"
                        placeholder="Minimum 6 characters"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">First Name</label>
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Last Name</label>
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-300">Role *</label>
                      <div className="relative">
                        <select
                          required
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-slate-200 outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900"
                        >
                          <option value="ROLE_AGENT">Support Agent</option>
                          <option value="ROLE_ADMIN">Administrator</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || !formData.username || !formData.email || !formData.password}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
