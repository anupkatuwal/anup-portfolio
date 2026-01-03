import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "../api/client";
import { updateProject } from "../api/client";


export function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
    live_link: "",
  });
  const [editingId, setEditingId] = useState(null);


  /* ---------- LOAD PROJECTS ---------- */
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const created = await createProject({
        title: form.title,
        description: form.description,
        tech_stack: form.tech_stack,
        github_link: form.github_link || null,
        live_link: form.live_link || null,
      });

      setProjects((prev) => [created, ...prev]);
      setForm({
        title: "",
        description: "",
        tech_stack: "",
        github_link: "",
        live_link: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create project. Are you logged in?");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="page">
      <div className="container stack-lg">
        <h1 className="section-title">Admin Dashboard</h1>

        {error && <p className="card-text">{error}</p>}

        {/* CREATE PROJECT */}
        <section className="card">
          <h2 className="card-title">Add Project</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Tech Stack (comma separated)</label>
              <input
                name="tech_stack"
                value={form.tech_stack}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>GitHub Link</label>
              <input
                name="github_link"
                value={form.github_link}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Live Link</label>
              <input
                name="live_link"
                value={form.live_link}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary">Create Project</button>
          </form>
        </section>

        {/* PROJECT LIST */}
        <section className="card">
          <h2 className="card-title">Projects</h2>

          {!loading &&
  projects.map((p) => (
    <div key={p.id} className="card" style={{ marginTop: "10px" }}>
      {editingId === p.id ? (
        <>
          <input
            value={p.title}
            onChange={(e) =>
              setProjects((prev) =>
                prev.map((x) =>
                  x.id === p.id ? { ...x, title: e.target.value } : x
                )
              )
            }
          />
          <textarea
            value={p.description}
            onChange={(e) =>
              setProjects((prev) =>
                prev.map((x) =>
                  x.id === p.id ? { ...x, description: e.target.value } : x
                )
              )
            }
          />
          <button
            className="btn btn-primary"
            onClick={async () => {
              const updated = await updateProject(p.id, p);
              setProjects((prev) =>
                prev.map((x) => (x.id === p.id ? updated : x))
              );
              setEditingId(null);
            }}
          >
            Save
          </button>
          <button className="btn btn-ghost" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <strong>{p.title}</strong>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-ghost"
              onClick={() => setEditingId(p.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  ))}

        </section>
      </div>
    </div>
  );
}
