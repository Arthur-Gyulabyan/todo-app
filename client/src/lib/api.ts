type HttpMethod = 'GET' | 'POST';

const BASE_URL = '/api/v1';

interface RequestOptions extends RequestInit {
  body?: Record<string, unknown>;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options?: RequestOptions
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    ...options,
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }

  // Handle cases where the response might be empty (e.g., successful delete with 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body: Record<string, unknown>, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
};