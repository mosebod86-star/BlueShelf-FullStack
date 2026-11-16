const express = require("express");
const db = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.id, t.book_id AS bookId, b.title AS bookTitle,
              t.user_id AS userId, u.name AS userName,
              t.transaction_type AS type, t.quantity, t.notes,
              t.created_at AS createdAt
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load transactions." });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { bookId, userId, type, quantity, notes } = req.body;
  const amount = Number(quantity);

  if (!bookId || !["ADD_STOCK", "BORROW", "RETURN"].includes(type) ||
      !Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ message: "Provide a book, valid transaction type and quantity greater than zero." });
  }
  if (type === "BORROW" && !userId) {
    return res.status(400).json({ message: "Select the member borrowing the book." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [books] = await connection.execute(
      "SELECT id, quantity, available_quantity FROM books WHERE id=? FOR UPDATE",
      [bookId]
    );
    if (!books.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Book not found." });
    }

    const book = books[0];
    let total = book.quantity;
    let available = book.available_quantity;

    if (type === "ADD_STOCK") {
      total += amount;
      available += amount;
    } else if (type === "BORROW") {
      if (available < amount) {
        await connection.rollback();
        return res.status(400).json({ message: "There are not enough available copies." });
      }
      available -= amount;
    } else {
      if (available + amount > total) {
        await connection.rollback();
        return res.status(400).json({ message: "Returned quantity exceeds the number currently borrowed." });
      }
      available += amount;
    }

    await connection.execute(
      "UPDATE books SET quantity=?, available_quantity=? WHERE id=?",
      [total, available, bookId]
    );
    const [insert] = await connection.execute(
      `INSERT INTO transactions (book_id, user_id, transaction_type, quantity, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [bookId, userId || null, type, amount, notes || null]
    );
    await connection.commit();

    const [rows] = await db.execute(
      `SELECT t.id, t.book_id AS bookId, b.title AS bookTitle,
              t.user_id AS userId, u.name AS userName,
              t.transaction_type AS type, t.quantity, t.notes,
              t.created_at AS createdAt
       FROM transactions t JOIN books b ON b.id=t.book_id
       LEFT JOIN users u ON u.id=t.user_id WHERE t.id=?`,
      [insert.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Could not record transaction." });
  } finally {
    connection.release();
  }
});

module.exports = router;
