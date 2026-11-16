import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Transactions() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ bookId: "", userId: "", type: "ADD_STOCK", quantity: "1", notes: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [b, t] = await Promise.all([apiRequest("/books"), apiRequest("/transactions")]);
    setBooks(b); setTransactions(t);
    try { setUsers(await apiRequest("/users")); } catch { setUsers([]); }
  }
  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  async function submit(event) {
    event.preventDefault(); setError(""); setMessage("");
    try {
      await apiRequest("/transactions", { method: "POST", body: JSON.stringify({ ...form, quantity: Number(form.quantity), userId: form.userId || null }) });
      setMessage("Transaction recorded and stock updated.");
      setForm({ ...form, quantity: "1", notes: "" });
      await load();
    } catch (err) { setError(err.message); }
  }

  return <div className="page">
    <div className="page-heading"><div><p className="eyebrow">CIRCULATION</p><h1>Transactions</h1><p className="muted">Record new stock, borrowed books and returns.</p></div></div>
    {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <section className="panel">
      <div className="panel-heading"><h2>Record a transaction</h2></div>
      <form className="form-grid" onSubmit={submit}>
        <label className="field"><span>Book</span><select value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })} required><option value="">Select a book</option>{books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.available_quantity} available)</option>)}</select></label>
        <label className="field"><span>Activity</span><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="ADD_STOCK">Add stock</option><option value="BORROW">Borrow</option><option value="RETURN">Return</option></select></label>
        {form.type === "BORROW" && <label className="field"><span>Member</span><select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required><option value="">Select member</option>{users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.membershipId}</option>)}</select></label>}
        <label className="field"><span>Quantity</span><input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></label>
        <label className="field field-wide"><span>Notes (optional)</span><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Add a short note" /></label>
        <div className="form-actions"><button className="button button-primary">Save transaction</button></div>
      </form>
    </section>
    <section className="panel"><div className="panel-heading"><h2>Transaction history</h2><span className="pill">{transactions.length} records</span></div>
      <div className="table-wrap"><table><thead><tr><th>Book</th><th>Member</th><th>Activity</th><th>Quantity</th><th>Notes</th><th>Date</th></tr></thead><tbody>
        {transactions.map(t => <tr key={t.id}><td className="book-title">{t.bookTitle}</td><td>{t.userName || "—"}</td><td><span className="type-tag">{t.type.replace("_", " ")}</span></td><td>{t.quantity}</td><td>{t.notes || "—"}</td><td>{new Date(t.createdAt).toLocaleString()}</td></tr>)}
        {!transactions.length && <tr><td colSpan="6" className="empty">No transactions yet.</td></tr>}
      </tbody></table></div>
    </section>
  </div>;
}
