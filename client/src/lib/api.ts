type HttpMethod = "GET" | "POST";

const BASE_URL = "/api/v1";

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (res.ok) {
    return isJson ? ((await res.json()) as T) : ((null as unknown) as T);
  }

  let message = res.statusText;
  try {
    if (isJson) {
      const data = await res.json();
      if (data?.message) message = data.message;
    } else {
      const text = await res.text();
      if (text) message = text;
    }
  } catch {
    // ignore parsing error
  }
  throw new Error(message || "Request failed");
}

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
};