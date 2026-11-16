const express = require("express");
const db = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM books ORDER BY title ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load books." });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    const amount = Number(quantity);
    if (!title || !author || !genre || !isbn || !Number.isInteger(amount) || amount < 0) {
      return res.status(400).json({ message: "Enter valid book details and a quantity of zero or more." });
    }
    const [result] = await db.execute(
      `INSERT INTO books (title, author, genre, isbn, quantity, available_quantity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), amount, amount]
    );
    const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "That ISBN already exists." });
    console.error(error);
    res.status(500).json({ message: "Could not add book." });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, author, genre, isbn } = req.body;
    if (!title || !author || !genre || !isbn) {
      return res.status(400).json({ message: "All book fields are required." });
    }
    const [result] = await db.execute(
      "UPDATE books SET title = ?, author = ?, genre = ?, isbn = ? WHERE id = ?",
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: "Book not found." });
    const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "That ISBN already exists." });
    console.error(error);
    res.status(500).json({ message: "Could not update book." });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM books WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ message: "This book has transaction history and cannot be deleted." });
    }
    console.error(error);
    res.status(500).json({ message: "Could not delete book." });
  }
});

module.exports = router;
