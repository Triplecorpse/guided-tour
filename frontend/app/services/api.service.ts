function fetchWrapper<T>(url: string, params: RequestInit): Promise<T> {
  return fetch(url, {
    ...params,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...params.headers,
    },
  }).then((response) => response.json());
}

export function get<T>(url: string, params?: RequestInit): Promise<T> {
  return fetchWrapper<T>(url, {
    ...params,
    method: "GET",
  });
}
