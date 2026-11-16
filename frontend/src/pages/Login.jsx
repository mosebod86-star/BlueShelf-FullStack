import { useState } from "react";
import { apiRequest } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@blueshelf.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      onLogin(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">B</div>
        <p className="eyebrow">LIBRARY MANAGEMENT SYSTEM</p>
        <h1>Welcome to BlueShelf</h1>
        <p className="muted">Sign in to manage your library.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <label>Email address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="button button-primary full-width" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="login-hint">Demo admin: admin@blueshelf.com / admin123</p>
      </form>
    </main>
  );
}
