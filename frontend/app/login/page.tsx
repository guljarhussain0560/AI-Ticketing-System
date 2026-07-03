"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, Mail, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { JwtResponse, ApiError } from "@/types";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or Email is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await api.post<JwtResponse>("/api/auth/login", data);
      const { accessToken, username, roles } = response.data;
      
      login(accessToken, username, roles);
      
      // Redirect to dashboard home page
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        const errorData = err.response.data as ApiError;
        setApiError(errorData.message || "Invalid credentials provided");
      } else {
        setApiError("Unable to connect to the server. Please check if the backend is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Gradients/Blobs for modern premium visual impact */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="w-full max-w-md z-10">
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-500/10 px-4 py-2 text-indigo-400 border border-indigo-500/20 backdrop-blur-md mb-4">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">AI Service Desk</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-400">
            AURA
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            AI-Powered Email Ticket Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Sign In to Dashboard</h2>

          {apiError && (
            <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 mb-6 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Authentication failed</p>
                <p className="opacity-90">{apiError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username/Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Username or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  {...register("usernameOrEmail")}
                  type="text"
                  placeholder="admin or admin@ticketgen.com"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-xs font-medium text-red-400 pl-1">{errors.usernameOrEmail.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Key className="h-5 w-5" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-400 pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-75 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Secure enterprise connection. Default credentials: <code className="text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">admin / password</code>
        </p>
      </div>
    </div>
  );
}
