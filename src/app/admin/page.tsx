"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { apiPost } from "@/lib/api";
import {
  ADMIN_DASHBOARD_PATH,
  setAdminToken,
} from "@/lib/adminAuth";
import SiteLogo from "@/components/SiteLogo";
import AdminGuestGuard from "@/components/admin/AdminGuestGuard";

type LoginResponse = { access_token: string; token_type: string };

function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiPost<LoginResponse>("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      setAdminToken(res.access_token);
      router.replace(ADMIN_DASHBOARD_PATH);
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <SiteLogo size="lg" className="mb-3 justify-center" />
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Admin Control Portal</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-6">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="admin@vfiveeducation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-title font-bold py-3.5 rounded-xl mt-2 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Access Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
            Sign in with your admin email and password
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminGuestGuard>
      <AdminLoginForm />
    </AdminGuestGuard>
  );
}
