const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://91.98.235.142:3000";

/**
 * Helper to call the Go backend API from Next.js server-side routes.
 */
export async function backendFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${BACKEND_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
}

/**
 * Helper to call the Go backend and parse JSON response.
 */
export async function backendJson<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await backendFetch(path, options);
  return res.json();
}

export { BACKEND_URL };
