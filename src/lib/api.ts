import { getAdminToken } from "@/lib/adminAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Request failed: ${path}`;
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? authHeaders() : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Request failed: ${path}`;
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : `Request failed: ${path}`;
    throw new ApiError(message, res.status);
  }
}

export type UploadResponse = { url: string; public_id: string };
export type UploadStatus = { configured: boolean; max_upload_mb: number };

export async function apiUploadImage(
  file: File,
  folder = "cms"
): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch(`${API_BASE}/api/uploads/image`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : "Image upload failed";
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<UploadResponse>;
}

export async function apiGetUploadStatus(): Promise<UploadStatus> {
  return apiGet<UploadStatus>("/api/uploads/status");
}

export { API_BASE };
