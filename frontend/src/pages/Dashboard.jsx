import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiRequest("/books"), apiRequest("/transactions")])
      .then(([bookData, transactionData]) => {
        setBooks(bookData);
        setTransactions(transactionData);
      })
      .catch(err => setError(err.message));
  }, []);

  const totalCopies = books.reduce((sum, book) => sum + Number(book.quantity), 0);
  const available = books.reduce((sum, book) => sum + Number(book.available_quantity), 0);
  const lowStock = books.filter(book => Number(book.available_quantity) < 2);

  return (
    <div className="page">
      <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Here's what's happening in your library.</p></div></div>
      {error && <div className="alert alert-error">{error}</div>}
      <section className="stats-grid">
        <Stat title="Book titles" value={books.length} detail="Different titles in catalogue" />
        <Stat title="Total copies" value={totalCopies} detail="Copies owned by the library" />
        <Stat title="Available copies" value={available} detail="Ready to be borrowed" />
        <Stat title="Transactions" value={transactions.length} detail="Recorded activity" />
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>Current availability</h2><p className="muted">Books with fewer than two available copies are highlighted.</p></div><span className="pill">{lowStock.length} low stock</span></div>
        <BookTable books={books} />
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Recent transactions</h2></div>
        <div className="table-wrap"><table><thead><tr><th>Book</th><th>Member</th><th>Activity</th><th>Quantity</th><th>Date</th></tr></thead><tbody>
          {transactions.slice(0, 6).map(t => <tr key={t.id}><td>{t.bookTitle}</td><td>{t.userName || "—"}</td><td><span className="type-tag">{t.type.replace("_", " ")}</span></td><td>{t.quantity}</td><td>{new Date(t.createdAt).toLocaleDateString()}</td></tr>)}
          {!transactions.length && <tr><td colSpan="5" className="empty">No transactions recorded yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function Stat({ title, value, detail }) {
  return <article className="stat-card"><p>{title}</p><strong>{value}</strong><span>{detail}</span></article>;
}

function BookTable({ books }) {
  return <div className="table-wrap"><table><thead><tr><th>Book</th><th>Author</th><th>Genre</th><th>Available</th><th>Total</th><th>Status</th></tr></thead><tbody>
    {books.map(book => <tr key={book.id} className={Number(book.available_quantity) < 2 ? "low-stock-row" : ""}><td className="book-title">{book.title}</td><td>{book.author}</td><td>{book.genre}</td><td>{book.available_quantity}</td><td>{book.quantity}</td><td><span className={Number(book.available_quantity) < 2 ? "status status-low" : "status status-ok"}>{Number(book.available_quantity) < 2 ? "Low stock" : "Available"}</span></td></tr>)}
    {!books.length && <tr><td colSpan="6" className="empty">No books yet. Add your first book on the Books page.</td></tr>}
  </tbody></table></div>;
}
