"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import {
  ADMIN_LOGIN_PATH,
  verifyAdminSession,
} from "@/lib/adminAuth";

type Props = {
  children: React.ReactNode;
};

/**
 * Protects /admin/dashboard — verifies session before rendering children.
 * Invalid or missing tokens redirect to login with replace (no history stack leak).
 */
export default function AdminAuthGuard({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const ok = await verifyAdminSession();
      if (cancelled) return;
      if (ok) {
        setStatus("allowed");
      } else {
        setStatus("denied");
        router.replace(ADMIN_LOGIN_PATH);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Lock className="animate-pulse" size={24} />
          <span>Verifying admin session…</span>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return null;
  }

  return <>{children}</>;
}
