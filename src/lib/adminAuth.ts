import { apiGet } from "@/lib/api";

export const ADMIN_TOKEN_KEY = "vfive_admin_token";
export const ADMIN_LOGIN_PATH = "/admin";
export const ADMIN_DASHBOARD_PATH = "/admin/dashboard";

export type AdminMe = {
  id: number;
  email: string;
  name: string;
  role: string;
  authenticated?: boolean;
};

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/** Returns true only if a token exists and /api/auth/me succeeds. Clears invalid tokens. */
export async function verifyAdminSession(): Promise<boolean> {
  if (!getAdminToken()) return false;
  try {
    await apiGet<AdminMe>("/api/auth/me");
    return true;
  } catch {
    clearAdminSession();
    return false;
  }
}

export async function fetchAdminMe(): Promise<AdminMe> {
  return apiGet<AdminMe>("/api/auth/me");
}
