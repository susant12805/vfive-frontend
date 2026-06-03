"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import {
  ADMIN_DASHBOARD_PATH,
  verifyAdminSession,
} from "@/lib/adminAuth";

type Props = {
  children: React.ReactNode;
};

/**
 * Login page only — if already signed in, send to dashboard with replace
 * so the Back button does not bounce through login again.
 */
export default function AdminGuestGuard({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "guest" | "redirecting">("checking");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const ok = await verifyAdminSession();
      if (cancelled) return;
      if (ok) {
        setStatus("redirecting");
        router.replace(ADMIN_DASHBOARD_PATH);
      } else {
        setStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "checking" || status === "redirecting") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Lock className="animate-pulse" size={24} />
          <span className="text-sm">Checking session…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
