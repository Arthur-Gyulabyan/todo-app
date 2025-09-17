const BASE_URL = "/api/v1";

interface RequestOptions extends RequestInit {
  data?: unknown;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  post: async <T>(path: string, data: unknown): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  // Add put, delete, patch if needed based on the OpenAPI spec.
  // For this spec, update and delete are POST requests, so no other methods are strictly needed.
};