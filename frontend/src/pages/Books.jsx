import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const emptyForm = { title: "", author: "", genre: "", isbn: "", quantity: "1" };

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadBooks() {
    try { setBooks(await apiRequest("/books")); }
    catch (err) { setError(err.message); }
  }
  useEffect(() => { loadBooks(); }, []);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError(""); setMessage("");
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      if (editingId) {
        await apiRequest(`/books/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Book details updated.");
      } else {
        await apiRequest("/books", { method: "POST", body: JSON.stringify(payload) });
        setMessage("Book added successfully.");
      }
      setForm(emptyForm); setEditingId(null); await loadBooks();
    } catch (err) { setError(err.message); }
  }

  function edit(book) {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, genre: book.genre, isbn: book.isbn, quantity: String(book.quantity) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this book?")) return;
    try { await apiRequest(`/books/${id}`, { method: "DELETE" }); setMessage("Book deleted."); await loadBooks(); }
    catch (err) { setError(err.message); }
  }

  const filtered = books.filter(book => `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="page">
    <div className="page-heading"><div><p className="eyebrow">CATALOGUE</p><h1>Book management</h1><p className="muted">Add, find and maintain your library collection.</p></div></div>
    {error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}
    <section className="panel">
      <div className="panel-heading"><h2>{editingId ? "Update book" : "Add a new book"}</h2></div>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Book title"><input name="title" value={form.title} onChange={change} required maxLength="180" /></Field>
        <Field label="Author"><input name="author" value={form.author} onChange={change} required /></Field>
        <Field label="Genre"><input name="genre" value={form.genre} onChange={change} required /></Field>
        <Field label="ISBN"><input name="isbn" value={form.isbn} onChange={change} required /></Field>
        <Field label="Initial quantity"><input type="number" min="0" name="quantity" value={form.quantity} onChange={change} required disabled={Boolean(editingId)} /></Field>
        <div className="form-actions"><button className="button button-primary">{editingId ? "Save changes" : "Add book"}</button>{editingId && <button type="button" className="button button-light" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}</div>
      </form>
      {editingId && <p className="form-note">Stock is changed from the Transactions page so that stock history remains accurate.</p>}
    </section>
    <section className="panel">
      <div className="panel-heading responsive-heading"><div><h2>Books catalogue</h2><p className="muted">{filtered.length} book titles</p></div><input className="search-input" placeholder="Search title, author or ISBN..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="table-wrap"><table><thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Available / Total</th><th>Actions</th></tr></thead><tbody>
        {filtered.map(book => <tr key={book.id}><td className="book-title">{book.title}</td><td>{book.author}</td><td>{book.genre}</td><td>{book.isbn}</td><td>{book.available_quantity} / {book.quantity}</td><td className="actions"><button className="button button-small button-light" onClick={() => edit(book)}>Update</button><button className="button button-small button-danger" onClick={() => remove(book.id)}>Delete</button></td></tr>)}
        {!filtered.length && <tr><td colSpan="6" className="empty">No matching books found.</td></tr>}
      </tbody></table></div>
    </section>
  </div>;
}

function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }
