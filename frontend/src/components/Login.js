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

export default function Login({ onLoginSuccess }) {
  const [form,  setForm]  = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${API}/login`,
        form,
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
      <h2>Sign in to TasKify</h2>

      {error && <p className="tk-error">{error}</p>}

      <input
        className="tk-input"
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="tk-input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button className="tk-btn tk-btn-primary" onClick={handleLogin}>
        Login
      </button>

      <p style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No account?{" "}
        <Link to="/register" style={{ color: "var(--primary)" }}>Register</Link>
      </p>
    </div>
  );
}