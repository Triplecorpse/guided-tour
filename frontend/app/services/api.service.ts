function fetchWrapper<T>(url: string, params: RequestInit): Promise<T> {
  return fetch(url, {
    ...params,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...params.headers,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message === "TOKEN_EXPIRED") {
        return get(ROUTES.authentication.refresh).then(() =>
          fetchWrapper<T>(url, params),
        );
      }
      return response;
    });
}

export function get<T>(url: string, params?: RequestInit): Promise<T> {
  return fetchWrapper<T>(url, {
    ...params,
    method: "GET",
  });
}

export function post<T>(
  url: string,
  data: any,
  params?: RequestInit,
): Promise<T> {
  return fetchWrapper<T>(url, {
    ...params,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function patch<T>(
  url: string,
  data: any,
  params?: RequestInit,
): Promise<T> {
  return fetchWrapper<T>(url, {
    ...params,
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function del<T>(url: string, params?: RequestInit): Promise<T> {
  return fetchWrapper<T>(url, {
    ...params,
    method: "DELETE",
  });
}
