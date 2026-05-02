import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/todos";

function parseError(err) {
  const detail = err.response?.data?.detail;
  if (!detail)                    return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))      return detail.map(d => d.msg).join(", ");
  return "Something went wrong";
}

export default function Register({ onLoginSuccess }) {
  const [form,  setForm]  = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${API}/register`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );
      const res = await axios.post(
        `${API}/login`,
        { username: form.username, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );
      onLoginSuccess(res.data.access_token);   // ← update App state first
      navigate("/");                            // ← then navigate
    } catch (err) {
      setError(parseError(err));
    }
  };

  return (
    <div className="tk-auth-wrap">
      <h2>Create an account</h2>

      {error && <p className="tk-error">{error}</p>}

      <input
        className="tk-input"
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="tk-input"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="tk-input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button className="tk-btn tk-btn-primary" onClick={handleRegister}>
        Register
      </button>

      <p style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--primary)" }}>Login</Link>
      </p>
    </div>
  );
}