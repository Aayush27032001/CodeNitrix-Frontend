export async function get(route = "", { params } = {}, token) {
  const url = new URL(route, process.env.REACT_APP_BACKEND_URL);

  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  return fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then(async (response) => ({
      ...(await response.json()),
      status: response.status,
      ok: response.ok,
    }))
    .catch(console.log);
}

export async function post(route = "", body = {}) {
  const url = new URL(route, process.env.REACT_APP_BACKEND_URL);
  const token = localStorage.getItem("token");
  return fetch(url, {
    method: "POST",
    headers: token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(async (response) => ({
      ...(await response.json()),
      status: response.status,
      ok: response.ok,
    }))
    .catch(console.log);
}
