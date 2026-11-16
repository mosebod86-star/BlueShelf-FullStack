import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const blank = { name: "", membershipId: "", role: "MEMBER", email: "", phone: "", password: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() { setUsers(await apiRequest("/users")); }
  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError(""); setMessage("");
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      await apiRequest(editingId ? `/users/${editingId}` : "/users", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      setMessage(editingId ? "User updated." : "User added.");
      setForm(blank); setEditingId(null); await load();
    } catch (err) { setError(err.message); }
  }

  function edit(user) {
    setEditingId(user.id);
    setForm({ name: user.name, membershipId: user.membershipId, role: user.role, email: user.email, phone: user.phone || "", password: "" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this user?")) return;
    try { await apiRequest(`/users/${id}`, { method: "DELETE" }); setMessage("User deleted."); await load(); }
    catch (err) { setError(err.message); }
  }

  return <div className="page">
    <div className="page-heading"><div><p className="eyebrow">PEOPLE</p><h1>User management</h1><p className="muted">Manage library members, librarians and administrators.</p></div></div>
    {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <section className="panel"><div className="panel-heading"><h2>{editingId ? "Update user" : "Add a user"}</h2></div>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Full name"><input name="name" value={form.name} onChange={change} required /></Field>
        <Field label="Membership ID"><input name="membershipId" value={form.membershipId} onChange={change} required /></Field>
        <Field label="Role"><select name="role" value={form.role} onChange={change}><option value="MEMBER">Member</option><option value="LIBRARIAN">Librarian</option><option value="ADMIN">Administrator</option></select></Field>
        <Field label="Email"><input type="email" name="email" value={form.email} onChange={change} required /></Field>
        <Field label="Phone (optional)"><input name="phone" value={form.phone} onChange={change} /></Field>
        <Field label={editingId ? "New password (optional)" : "Password"}><input type="password" name="password" value={form.password} onChange={change} minLength="6" required={!editingId} /></Field>
        <div className="form-actions"><button className="button button-primary">{editingId ? "Save changes" : "Add user"}</button>{editingId && <button type="button" className="button button-light" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}</div>
      </form>
    </section>
    <section className="panel"><div className="panel-heading"><h2>Registered users</h2><span className="pill">{users.length} users</span></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Email</th><th>Actions</th></tr></thead><tbody>
        {users.map(user => <tr key={user.id}><td className="book-title">{user.name}</td><td>{user.membershipId}</td><td><span className="type-tag">{user.role}</span></td><td>{user.email}</td><td className="actions"><button className="button button-small button-light" onClick={() => edit(user)}>Update</button><button className="button button-small button-danger" onClick={() => remove(user.id)}>Delete</button></td></tr>)}
        {!users.length && <tr><td colSpan="5" className="empty">No users found.</td></tr>}
      </tbody></table></div>
    </section>
  </div>;
}
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }
