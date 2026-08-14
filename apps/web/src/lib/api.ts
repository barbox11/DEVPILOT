export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const TOKEN_KEY = "devpilot-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const token = getToken();
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (auth && token) requestHeaders.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // respuesta sin cuerpo JSON
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? ((body as { error: { message?: string } }).error?.message ??
          "Error de solicitud")
        : "Error de solicitud";
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiOptions) =>
    api<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, data?: unknown, options?: ApiOptions) =>
    api<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
  patch: <T>(path: string, data?: unknown, options?: ApiOptions) =>
    api<T>(path, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
  del: <T>(path: string, options?: ApiOptions) =>
    api<T>(path, { method: "DELETE", ...options }),
};
