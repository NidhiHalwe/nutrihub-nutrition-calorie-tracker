const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch(path, options = {}, withAuth = false) {
  let headers = { 'Content-Type': 'application/json', ...options.headers };
  if (withAuth) {
    const token = JSON.parse(localStorage.getItem('foodhub_user'))?.token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}





