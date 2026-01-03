// src/api/client.js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

/* ---------------- AUTH ---------------- */
export async function login(username, password) {
  const res = await apiClient.post(
    "/auth/login",
    new URLSearchParams({ username, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
}

/* ---------------- PROJECTS ---------------- */
export async function fetchProjects() {
  const res = await apiClient.get("/projects");
  return res.data;
}

export async function createProject(payload) {
  const token = localStorage.getItem("access_token");
  const res = await apiClient.post("/projects", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteProject(id) {
  const token = localStorage.getItem("access_token");
  const res = await apiClient.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ---------------- CONTACT ---------------- */
export async function fetchContacts() {
  const token = localStorage.getItem("access_token");
  const res = await apiClient.get("/admin/contacts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteContact(id) {
  const token = localStorage.getItem("access_token");
  const res = await apiClient.delete(`/admin/contacts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProject(id, payload) {
  const token = localStorage.getItem("access_token");
  const res = await apiClient.put(`/projects/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
